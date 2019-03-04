"use strict";

var _omi = typeof require === 'function'? require('omi') : window.Omi

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

!customElements.get('ckeditor-element') && (0, _omi.define)('ckeditor-element',
/*#__PURE__*/
function (_WeElement) {
  _inherits(_class, _WeElement);

  function _class() {
    _classCallCheck(this, _class);

    return _possibleConstructorReturn(this, _getPrototypeOf(_class).apply(this, arguments));
  }

  _createClass(_class, [{
    key: "install",
    value: function install(props) {
      // After mounting the editor, the variable will contain a reference to the created editor.
      // @see: https://ckeditor.com/docs/ckeditor5/latest/api/module_core_editor_editor-Editor.html
      this.editor = null;
    }
  }, {
    key: "updated",
    value: function updated() {
      if (this.editor && this.editor.getData() !== this.props.data) {
        this.editor.setData(this.props.data);
      }
    } // Initialize the editor when the component ismounted.

  }, {
    key: "installed",
    value: function installed() {
      this._initializeEditor();
    } // Destory the editor before unmounting the component.

    /** This shoud be using willBeUninstalled if omi has */

  }, {
    key: "uninstall",
    value: function uninstall() {
      this._destroyEditor();
    } // Render a <div> element which will be replaced by CKEditor.

  }, {
    key: "render",
    value: function render(props) {
      var _this = this;

      return Omi.createElement(
        'div',
        { style: { width: props.width + 'px', height: props.height + 'px' } },
        Omi.createElement('canvas', { ref: function ref(e) {
            _this.canvas = e;
          } })
      );
    }
  }, {
    key: "_initializeEditor",
    value: function _initializeEditor() {
      var _this2 = this;

      this.props.editor.create(this.base, this.props.config).then(function (editor) {
        _this2.editor = editor;

        if (_this2.props.data) {
          _this2.editor.setData(_this2.props.data);
        }

        if (_this2.props.onInit) {
          _this2.props.onInit(_this2.editor);
        }

        var document = _this2.editor.model.document;
        document.on('change:data', function (event) {
          /* istanbul ignore else */
          if (_this2.props.onChange) {
            _this2.props.onChange(event, editor);
          }
        });
      }).catch(function (error) {
        console.error(error);
      });
    }
  }, {
    key: "_destroyEditor",
    value: function _destroyEditor() {
      var _this3 = this;

      if (this.editor) {
        this.editor.destroy().then(function () {
          _this3.editor = null;
        });
      }
    }
  }]);

  return _class;
}(_omi.WeElement));