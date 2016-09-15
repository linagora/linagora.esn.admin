'use strict';

angular.module('linagora.esn.admin')

.controller('adminRolesController', function() {
  var self = this;

  self.administrators = [
    {_id: 1, firstname: 'Cuong', lastname: 'Nguyen', emails: ['ngoccuong94@gmail.com', 'cuong94gmail.com'], promoted: '01/02/2016'},
    {_id: 2, firstname: 'Nam', lastname: 'Nguyen', emails: ['namnguyen94@gmail.com', 'nam94gmail.com'], promoted: '01/02/2016'},
    {_id: 3, firstname: 'Quang', lastname: 'Trinh', emails: ['quangtrinh94@gmail.com', 'quang94gmail.com'], promoted: '01/02/2016'},
    {_id: 4, firstname: 'Thanh', lastname: 'Nguyen', emails: ['thanhnguyen94@gmail.com', 'thanh94gmail.com'], promoted: '01/02/2016'}
  ];
});
