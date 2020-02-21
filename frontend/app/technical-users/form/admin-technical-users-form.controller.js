(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin')
    .controller('adminTechnicalUsersFormController', adminTechnicalUsersFormController);

  function adminTechnicalUsersFormController(ADMIN_TECHNICAL_USER_TYPES) {
    var self = this;

    self.$onInit = $onInit;
    self.onAddBtnClick = onAddBtnClick;
    self.onRemoveBtnClick = onRemoveBtnClick;

    function $onInit() {
      self.technicalUser = self.technicalUser || {
        name: '',
        type: '',
        description: '',
        data: [
          {
            key: '',
            value: ''
          }
        ]
      };

      self.ADMIN_TECHNICAL_USER_TYPES = ADMIN_TECHNICAL_USER_TYPES;
    }

    function onAddBtnClick() {
      self.technicalUser.data.push({
        key: '',
        value: ''
      });
    }

    function onRemoveBtnClick(index) {
      self.technicalUser.data.splice(index, 1);
    }
  }
})(angular);
