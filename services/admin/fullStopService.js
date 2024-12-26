const { TimeConverter } = require('../../utils/timeUtils');
const SubscriptionControlService = require('./subscriptionControlService');
const VoucherControlService = require('./voucherControlService');
const WithdrawalControlService = require('./withdrawalControlService');
const StakingControlService = require('./stakingControlService');

class FullStopService {
  constructor() {
    this.subscriptionControl = new SubscriptionControlService();
    this.voucherControl = new VoucherControlService();
    this.withdrawalControl = new WithdrawalControlService();
    this.stakingControl = new StakingControlService();
  }

  isFullyStopped() {
    return (
      this.subscriptionControl.isSubscriptionsStopped() &&
      this.voucherControl.isVouchersStopped() &&
      this.withdrawalControl.isWithdrawalsStopped() &&
      this.stakingControl.isStakingStopped()
    );
  }

  async stopAll(duration) {
    try {
      await Promise.all([
        this.subscriptionControl.stopSubscriptions(duration),
        this.voucherControl.stopVouchers(duration),
        this.withdrawalControl.stopWithdrawals(duration),
        this.stakingControl.stopStaking(duration)
      ]);
      return true;
    } catch (error) {
      console.error('Error stopping all services:', error);
      throw new Error('Failed to stop all services');
    }
  }

  async resumeAll() {
    try {
      await Promise.all([
        this.subscriptionControl.resumeSubscriptions(),
        this.voucherControl.resumeVouchers(),
        this.withdrawalControl.resumeWithdrawals(),
        this.stakingControl.resumeStaking()
      ]);
      return true;
    } catch (error) {
      console.error('Error resuming all services:', error);
      throw new Error('Failed to resume all services');
    }
  }
}

module.exports = FullStopService;