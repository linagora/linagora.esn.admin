(function(angular) {
  'use strict';

  angular.module('linagora.esn.admin').controller('adminThemesController', adminThemesController);

  function adminThemesController(
    $stateParams,
    $scope,
    $q,
    $filter,
    _,
    esnI18nService,
    themesService,
    esnConfig,
    fileUploadService,
    rejectWithErrorNotification,
    ADMIN_LOADING_STATUS,
    ADMIN_THEMES_COLOR_VARIABLES
  ) {
    var self = this;

    self.themesServiceForDomain = themesService.forDomain($stateParams.domainId);
    self.status = ADMIN_LOADING_STATUS.loading;
    self.uploadLock = {};
    self.groupLength = 3;

    self.adminThemesColorVariablesGroups = _mapAdminThemesVariables(ADMIN_THEMES_COLOR_VARIABLES, self.groupLength);

    self.model = {
      colors: {
        originalValues: {},
        newValues: {}
      }
    };

    self.$onInit = $onInit;
    self.save = save;
    self.computeTextColor = computeTextColor;

    function $onInit() {
      self.status = ADMIN_LOADING_STATUS.loaded;
      _createModel(ADMIN_THEMES_COLOR_VARIABLES, 'colors', '#000');

      self.themesServiceForDomain.getTheme().then(function(theme) {
        ADMIN_THEMES_COLOR_VARIABLES.forEach(function(item) {
          self.model.colors.originalValues['_' + item.apiVariable] =
            self.model.colors.newValues['_' + item.apiVariable] =
              theme.colors[item.apiVariable] || item.default;
        });

        self.status = ADMIN_LOADING_STATUS.loaded;
      }).catch(function() {
        self.status = ADMIN_LOADING_STATUS.error;
      });
    }

    function computeTextColor(bgHexRepr) {
      if (bgHexRepr.toUpperCase() === '#FFF' || bgHexRepr.toUpperCase() === '#FFFFFF') {
        return '#000';
      }

      if (bgHexRepr.toUpperCase() === '#000' || bgHexRepr.toUpperCase() === '#000000') {
        return '#FFF';
      }

      var color = bgHexRepr.substring(1, bgHexRepr.length);
      var rgb = [0, 0, 0];

      if (color.length === 3) {
        rgb = [parseInt(color[0], 16), parseInt(color[1], 16), parseInt(color[2], 16)];
      } else {
        rgb = [
          parseInt(color.substring(0, 2), 16),
          parseInt(color.substring(2, 4), 16),
          parseInt(color.substring(4, 6), 16)
        ];
      }

      // Compute contrast ratio
      // Formula is available here: https://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef
      function relativeLuminance(_rbg) {
        var relrgb = _rbg.map(function(value) {
          var result = value / 255;

          return result <= 0.03928 ? (result / 12.92) : Math.pow((result + 0.055) / 1.055, 2.4);
        });

        return relrgb[0] * 0.2126 + relrgb[1] * 0.7152 + relrgb[2] * 0.0722;
      }

      function contrast(rgb1, rgb2) {
        var relLum1 = relativeLuminance(rgb1);
        var relLum2 = relativeLuminance(rgb2);

        return (Math.max(relLum1, relLum2) + 0.05) / (Math.min(relLum1, relLum2) + 0.05);
      }

      return contrast([255, 255, 255], rgb) > contrast([0, 0, 0], rgb) ? '#FFF' : '#000';
    }

    function save() {
      var newColors = ADMIN_THEMES_COLOR_VARIABLES.map(function(item) {
        return {key: item.apiVariable, value: self.model.colors[item.apiVariable]};
      });

      return self.themesServiceForDomain.saveTheme({colors: newColors, logos: {}}).then(function() {
        self.model.colors.originalValues = angular.copy(self.model.colors.newValues);
      }).finally(_mutatePristine);
    }

    function _mutatePristine() {
      if (self.uploadLock === true) { return ($scope.form.$pristine = true); }
      $scope.form.$pristine = true;
      [self.model.colors].forEach(function(object) {
        for (var originalValuesKey in object.originalValues) { // eslint-disable-line
          if (object.newValues[originalValuesKey] !== object.originalValues[originalValuesKey]) {
            $scope.form && ($scope.form.$pristine = false);
            break;
          }
        }
      });
    }

    function _mapAdminThemesVariables(array, groupLength) {
      var adminThemesVariablePairs = [];

      function _mapper(item) {
        if (!item) return undefined;

        var result = angular.copy(item);

        result.displayText = esnI18nService.translate(item.displayText).toString();

        return result;
      }

      for (var i = 0; i < array.length; i = i + groupLength) {
        var subgroup = [];

        for (var j = i; j < Math.min(array.length, i + groupLength); j++) {
          subgroup.push(_mapper(array[j]));
        }
        if (subgroup.length > 0) { adminThemesVariablePairs.push(subgroup); }
      }

      return {groups: adminThemesVariablePairs, groupLength: groupLength};
    }

    function _createModel(constant, modeldestination, defaultVal) {
      constant.forEach(function(item) {
        var backingPropertyName = '_' + item.apiVariable;

        self.model[modeldestination].originalValues[backingPropertyName] = defaultVal;
        self.model[modeldestination].newValues[backingPropertyName] = defaultVal;

        Object.defineProperty(self.model[modeldestination], item.apiVariable, {
          get: function() { return self.model[modeldestination].newValues[backingPropertyName]; },
          set: function(value) {
            self.model[modeldestination].newValues[backingPropertyName] = value;
            _mutatePristine();
          }
        });
      });
    }
  }
})(angular);
