webpackJsonp([51],{

/***/ "./src/pages/voucher_verification/Form.js":
/*!************************************************!*\
  !*** ./src/pages/voucher_verification/Form.js ***!
  \************************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utilities_RequestService__ = __webpack_require__(/*! ../../utilities/RequestService */ "./src/utilities/RequestService.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__config_Services__ = __webpack_require__(/*! ../../config/Services */ "./src/config/Services.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__error_ErrorGeneral__ = __webpack_require__(/*! ../error/ErrorGeneral */ "./src/pages/error/ErrorGeneral.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_Base_BaseComponent__ = __webpack_require__(/*! ../../components/Base/BaseComponent */ "./src/components/Base/BaseComponent.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_antd__ = __webpack_require__(/*! antd */ "./node_modules/antd/es/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_moment__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_moment__);
var _jsxFileName = '/Applications/MAMP/htdocs/amala/src/pages/voucher_verification/Form.js';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }









var Title = __WEBPACK_IMPORTED_MODULE_5_antd__["J" /* Typography */].Title;

var App = function (_React$Component) {
    _inherits(App, _React$Component);

    function App(props) {
        _classCallCheck(this, App);

        var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

        _this.closeModalSuccess = function () {
            _this.closeAndRefresh.current.click();
        };

        _this.verifyAction = function (e) {
            e.preventDefault();
            _this.props.form.validateFieldsAndScroll(function (err, input) {
                if (!err) {
                    _this.setState({ loading: true, formrender: true });
                    //define parameter
                    var certificateid = input.certificateid;
                    _this.getDetail(certificateid);
                }
            });
        };

        _this.redeemAction = function (e) {
            e.preventDefault();
            _this.setState({ loading: true });
            //define parameter
            var certificateid = _this.state.voucherData.vouchernumber;

            var url = __WEBPACK_IMPORTED_MODULE_2__config_Services__["a" /* api */].url.redemptioncertificate.updatestatus;
            var data = { certificateid: certificateid };
            var message = 'Data has been redeemed';

            Object(__WEBPACK_IMPORTED_MODULE_1__utilities_RequestService__["g" /* SaveRequest */])(url, data).then(function (response) {
                var _response$status = response.status,
                    responsecode = _response$status.responsecode,
                    responsemessage = _response$status.responsemessage;

                if (responsecode.substring(0, 1) === '0') {
                    message = responsemessage ? responsemessage : message;
                    __WEBPACK_IMPORTED_MODULE_4__components_Base_BaseComponent__["d" /* Alert */].success(message);
                    _this.closeModalSuccess();
                } else {
                    __WEBPACK_IMPORTED_MODULE_4__components_Base_BaseComponent__["d" /* Alert */].error(responsemessage);
                }
                _this.setState({ loading: false });
            });
        };

        _this.state = {
            formrender: true,
            loading: false,
            actionspage: 'create',
            titlepage: 'Verify New',
            voucherData: {}
        };
        _this.closeAndRefresh = __WEBPACK_IMPORTED_MODULE_0_react___default.a.createRef();
        return _this;
    }

    _createClass(App, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.checkPermission();
        }
    }, {
        key: 'checkPermission',
        value: function checkPermission() {
            var id = this.props.certificateid;
            if (id) {
                var titlepage = 'Detail';
                var actionspage = 'view';
                //change into update page
                this.setState({ titlepage: titlepage, actionspage: actionspage });
                this.props.setTitlePage(titlepage);
                this.getDetail(id, actionspage);
            }
        }
    }, {
        key: 'getDetail',
        value: function getDetail(certificateid, actionspage) {
            var _this2 = this;

            var url = actionspage === 'view' ? __WEBPACK_IMPORTED_MODULE_2__config_Services__["a" /* api */].url.redemptioncertificate.detail : __WEBPACK_IMPORTED_MODULE_2__config_Services__["a" /* api */].url.redemptioncertificate.voucherverification;
            var data = { certificateid: certificateid };
            this.setState({ loading: true });
            Object(__WEBPACK_IMPORTED_MODULE_1__utilities_RequestService__["c" /* DetailRequest */])(url, data).then(function (response) {
                if (response.status.responsecode.substring(0, 1) === '0') {
                    var result = response.result;
                    var redeemusers = result.redeemusers;

                    if (result.length !== 0) {
                        // voucher detail data
                        var vouchernumber = redeemusers.certificateid ? redeemusers.certificateid : '-';
                        var bookingcode = result.bookingcode ? result.bookingcode : '-';
                        var issuedby = result.ticketofficeuser ? result.ticketofficeuser : '-';
                        var issueddate = redeemusers.issueddate ? __WEBPACK_IMPORTED_MODULE_6_moment___default()(redeemusers.issueddate).format('DD/MM/YYYY') : '-';
                        var voucherexpireddate = redeemusers.endvaliditydate ? __WEBPACK_IMPORTED_MODULE_6_moment___default()(redeemusers.endvaliditydate).format('DD/MM/YYYY') : '-';
                        // voucher user data
                        var salutation = redeemusers.salutationcode ? redeemusers.salutationcode : '-';
                        var name = redeemusers.name ? redeemusers.name : '-';
                        var familyname = redeemusers.familyname ? redeemusers.familyname : '-';
                        var membercardnumber = redeemusers.memberiduser ? redeemusers.memberiduser : '-';
                        var voucherData = { vouchernumber: vouchernumber, bookingcode: bookingcode, issuedby: issuedby, issueddate: issueddate, voucherexpireddate: voucherexpireddate, salutation: salutation, name: name, familyname: familyname, membercardnumber: membercardnumber };
                        _this2.setState({ loading: false, voucherData: voucherData });
                    }
                } else {
                    _this2.setState({ responseCode: response.status.responsecode, responseMessage: response.status.responsemessage, formrender: false });
                }
                _this2.setState({ loading: false });
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            // const { cancelModal } = this.props;
            var _state = this.state,
                formrender = _state.formrender,
                loading = _state.loading,
                actionspage = _state.actionspage,
                voucherData = _state.voucherData;

            var formItemLayout = {
                labelCol: { xs: { span: 24 }, sm: { span: 7 } },
                wrapperCol: { xs: { span: 24 }, sm: { span: 16 } },
                colon: false
            };
            var formItemStyle = {
                style: { marginTop: 0, marginBottom: 0 }
            };

            var voucherDetail = '';
            if (Object.keys(voucherData).length) {
                voucherDetail = __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_5_antd__["A" /* Row */],
                    {
                        __source: {
                            fileName: _jsxFileName,
                            lineNumber: 124
                        },
                        __self: this
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        __WEBPACK_IMPORTED_MODULE_5_antd__["A" /* Row */],
                        { className: 'searching-form', __source: {
                                fileName: _jsxFileName,
                                lineNumber: 125
                            },
                            __self: this
                        },
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                            Title,
                            { level: 4, __source: {
                                    fileName: _jsxFileName,
                                    lineNumber: 126
                                },
                                __self: this
                            },
                            'Voucher Details'
                        ),
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                            __WEBPACK_IMPORTED_MODULE_5_antd__["h" /* Col */],
                            { span: 24, __source: {
                                    fileName: _jsxFileName,
                                    lineNumber: 127
                                },
                                __self: this
                            },
                            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                                __WEBPACK_IMPORTED_MODULE_5_antd__["n" /* Form */].Item,
                                Object.assign({ label: 'Voucher Number' }, formItemStyle, { labelCol: { span: 4 }, __source: {
                                        fileName: _jsxFileName,
                                        lineNumber: 128
                                    },
                                    __self: this
                                }),
                                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                                    'span',
                                    { className: 'ant-form-text', style: { wordBreak: 'break-all' }, __source: {
                                            fileName: _jsxFileName,
                                            lineNumber: 129
                                        },
                                        __self: this
                                    },
                                    voucherData.vouchernumber
                                )
                            )
                        ),
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                            __WEBPACK_IMPORTED_MODULE_5_antd__["h" /* Col */],
                            { span: 14, __source: {
                                    fileName: _jsxFileName,
                                    lineNumber: 132
                                },
                                __self: this
                            },
                            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                                __WEBPACK_IMPORTED_MODULE_5_antd__["n" /* Form */].Item,
                                Object.assign({ label: 'Booking Code' }, formItemStyle, {
                                    __source: {
                                        fileName: _jsxFileName,
                                        lineNumber: 133
                                    },
                                    __self: this
                                }),
                                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                                    'span',
                                    { className: 'ant-form-text', __source: {
                                            fileName: _jsxFileName,
                                            lineNumber: 134
                                        },
                                        __self: this
                                    },
                                    ': ',
                                    voucherData.bookingcode
                                )
                            ),
                            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                                __WEBPACK_IMPORTED_MODULE_5_antd__["n" /* Form */].Item,
                                Object.assign({ label: 'Issued By' }, formItemStyle, {
                                    __source: {
                                        fileName: _jsxFileName,
                                        lineNumber: 136
                                    },
                                    __self: this
                                }),
                                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                                    'span',
                                    { className: 'ant-form-text', __source: {
                                            fileName: _jsxFileName,
                                            lineNumber: 137
                                        },
                                        __self: this
                                    },
                                    ': ',
                                    voucherData.issuedby
                                )
                            )
                        ),
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                            __WEBPACK_IMPORTED_MODULE_5_antd__["h" /* Col */],
                            { span: 10, __source: {
                                    fileName: _jsxFileName,
                                    lineNumber: 140
                                },
                                __self: this
                            },
                            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                                __WEBPACK_IMPORTED_MODULE_5_antd__["n" /* Form */].Item,
                                Object.assign({ label: 'Issued Date' }, formItemStyle, {
                                    __source: {
                                        fileName: _jsxFileName,
                                        lineNumber: 141
                                    },
                                    __self: this
                                }),
                                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                                    'span',
                                    { className: 'ant-form-text', __source: {
                                            fileName: _jsxFileName,
                                            lineNumber: 142
                                        },
                                        __self: this
                                    },
                                    ': ',
                                    voucherData.issueddate
                                )
                            ),
                            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                                __WEBPACK_IMPORTED_MODULE_5_antd__["n" /* Form */].Item,
                                Object.assign({ label: 'Expired Date' }, formItemStyle, {
                                    __source: {
                                        fileName: _jsxFileName,
                                        lineNumber: 144
                                    },
                                    __self: this
                                }),
                                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                                    'span',
                                    { className: 'ant-form-text', __source: {
                                            fileName: _jsxFileName,
                                            lineNumber: 145
                                        },
                                        __self: this
                                    },
                                    ': ',
                                    voucherData.voucherexpireddate
                                )
                            )
                        )
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        __WEBPACK_IMPORTED_MODULE_5_antd__["A" /* Row */],
                        { className: 'searching-form', style: { marginTop: 15 }, __source: {
                                fileName: _jsxFileName,
                                lineNumber: 149
                            },
                            __self: this
                        },
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                            Title,
                            { level: 4, __source: {
                                    fileName: _jsxFileName,
                                    lineNumber: 150
                                },
                                __self: this
                            },
                            'Voucher User'
                        ),
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                            __WEBPACK_IMPORTED_MODULE_5_antd__["h" /* Col */],
                            { span: 14, __source: {
                                    fileName: _jsxFileName,
                                    lineNumber: 151
                                },
                                __self: this
                            },
                            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                                __WEBPACK_IMPORTED_MODULE_5_antd__["n" /* Form */].Item,
                                Object.assign({ label: 'Salutation' }, formItemStyle, {
                                    __source: {
                                        fileName: _jsxFileName,
                                        lineNumber: 152
                                    },
                                    __self: this
                                }),
                                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                                    'span',
                                    { className: 'ant-form-text', __source: {
                                            fileName: _jsxFileName,
                                            lineNumber: 153
                                        },
                                        __self: this
                                    },
                                    ': ',
                                    voucherData.salutation
                                )
                            ),
                            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                                __WEBPACK_IMPORTED_MODULE_5_antd__["n" /* Form */].Item,
                                Object.assign({ label: 'Name' }, formItemStyle, {
                                    __source: {
                                        fileName: _jsxFileName,
                                        lineNumber: 155
                                    },
                                    __self: this
                                }),
                                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                                    'span',
                                    { className: 'ant-form-text', __source: {
                                            fileName: _jsxFileName,
                                            lineNumber: 156
                                        },
                                        __self: this
                                    },
                                    ': ',
                                    voucherData.name
                                )
                            )
                        ),
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                            __WEBPACK_IMPORTED_MODULE_5_antd__["h" /* Col */],
                            { span: 10, __source: {
                                    fileName: _jsxFileName,
                                    lineNumber: 159
                                },
                                __self: this
                            },
                            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                                __WEBPACK_IMPORTED_MODULE_5_antd__["n" /* Form */].Item,
                                Object.assign({ label: 'Family Name' }, formItemStyle, {
                                    __source: {
                                        fileName: _jsxFileName,
                                        lineNumber: 160
                                    },
                                    __self: this
                                }),
                                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                                    'span',
                                    { className: 'ant-form-text', __source: {
                                            fileName: _jsxFileName,
                                            lineNumber: 161
                                        },
                                        __self: this
                                    },
                                    ': ',
                                    voucherData.familyname
                                )
                            ),
                            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                                __WEBPACK_IMPORTED_MODULE_5_antd__["n" /* Form */].Item,
                                Object.assign({ label: 'Card Number' }, formItemStyle, {
                                    __source: {
                                        fileName: _jsxFileName,
                                        lineNumber: 163
                                    },
                                    __self: this
                                }),
                                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                                    'span',
                                    { className: 'ant-form-text', __source: {
                                            fileName: _jsxFileName,
                                            lineNumber: 164
                                        },
                                        __self: this
                                    },
                                    ': ',
                                    voucherData.membercardnumber
                                )
                            )
                        )
                    )
                );
            }

            return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.Fragment,
                {
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 172
                    },
                    __self: this
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_5_antd__["D" /* Spin */],
                    { spinning: loading, __source: {
                            fileName: _jsxFileName,
                            lineNumber: 173
                        },
                        __self: this
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        __WEBPACK_IMPORTED_MODULE_5_antd__["n" /* Form */],
                        Object.assign({}, formItemLayout, {
                            __source: {
                                fileName: _jsxFileName,
                                lineNumber: 174
                            },
                            __self: this
                        }),
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                            __WEBPACK_IMPORTED_MODULE_5_antd__["A" /* Row */],
                            { style: { display: actionspage === 'view' ? 'none' : 'block' }, __source: {
                                    fileName: _jsxFileName,
                                    lineNumber: 175
                                },
                                __self: this
                            },
                            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                                __WEBPACK_IMPORTED_MODULE_5_antd__["h" /* Col */],
                                { span: 18, __source: {
                                        fileName: _jsxFileName,
                                        lineNumber: 176
                                    },
                                    __self: this
                                },
                                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_4__components_Base_BaseComponent__["E" /* InputText */], { form: this.props.form, labeltext: 'Voucher Number', datafield: 'certificateid', validationrules: ['required'], maxLength: '45', __source: {
                                        fileName: _jsxFileName,
                                        lineNumber: 177
                                    },
                                    __self: this
                                })
                            ),
                            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                                __WEBPACK_IMPORTED_MODULE_5_antd__["h" /* Col */],
                                { span: 6, style: { padding: 4 }, __source: {
                                        fileName: _jsxFileName,
                                        lineNumber: 179
                                    },
                                    __self: this
                                },
                                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_4__components_Base_BaseComponent__["g" /* Button */], { htmlType: 'button', type: 'primary', label: 'Verify', onClick: function onClick(e) {
                                        return _this3.verifyAction(e);
                                    }, __source: {
                                        fileName: _jsxFileName,
                                        lineNumber: 180
                                    },
                                    __self: this
                                })
                            )
                        ),
                        formrender ? voucherDetail : __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                            __WEBPACK_IMPORTED_MODULE_5_antd__["A" /* Row */],
                            {
                                __source: {
                                    fileName: _jsxFileName,
                                    lineNumber: 185
                                },
                                __self: this
                            },
                            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                                __WEBPACK_IMPORTED_MODULE_5_antd__["h" /* Col */],
                                { span: 24, __source: {
                                        fileName: _jsxFileName,
                                        lineNumber: 186
                                    },
                                    __self: this
                                },
                                this.state.responseMessage
                            )
                        )
                        // <ErrorGeneral {...this.props} message={this.state.responseMessage} type="modal" />
                        ,
                        actionspage !== 'view' && Object.keys(voucherData).length ? __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                            __WEBPACK_IMPORTED_MODULE_5_antd__["A" /* Row */],
                            { gutter: 24, type: 'flex', justify: 'center', style: { marginTop: 30 }, __source: {
                                    fileName: _jsxFileName,
                                    lineNumber: 194
                                },
                                __self: this
                            },
                            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_4__components_Base_BaseComponent__["g" /* Button */], { htmlType: 'button', type: 'primary', label: 'Redeem Voucher', onClick: function onClick(e) {
                                    return _this3.redeemAction(e);
                                }, __source: {
                                    fileName: _jsxFileName,
                                    lineNumber: 196
                                },
                                __self: this
                            }),
                            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                                'button',
                                { type: 'button', ref: this.closeAndRefresh, onClick: this.props.closemodalrefresh, className: 'hidden', __source: {
                                        fileName: _jsxFileName,
                                        lineNumber: 197
                                    },
                                    __self: this
                                },
                                'Close Refresh'
                            )
                        ) : ''
                    )
                )
            );
        }
    }]);

    return App;
}(__WEBPACK_IMPORTED_MODULE_0_react___default.a.Component);

/* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_5_antd__["n" /* Form */].create()(App));

/***/ }),

/***/ "./src/pages/voucher_verification/Index.js":
/*!*************************************************!*\
  !*** ./src/pages/voucher_verification/Index.js ***!
  \*************************************************/
/*! exports provided: default */
/*! all exports used */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config_Services__ = __webpack_require__(/*! ../../config/Services */ "./src/config/Services.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_Base_BaseComponent__ = __webpack_require__(/*! ../../components/Base/BaseComponent */ "./src/components/Base/BaseComponent.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_antd__ = __webpack_require__(/*! antd */ "./node_modules/antd/es/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__utilities_Helpers__ = __webpack_require__(/*! ../../utilities/Helpers */ "./src/utilities/Helpers.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__utilities_AuthService__ = __webpack_require__(/*! ../../utilities/AuthService */ "./src/utilities/AuthService.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_moment__ = __webpack_require__(/*! moment */ "./node_modules/moment/moment.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_moment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_moment__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__Form__ = __webpack_require__(/*! ./Form */ "./src/pages/voucher_verification/Form.js");
var _jsxFileName = '/Applications/MAMP/htdocs/amala/src/pages/voucher_verification/Index.js';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }










var Title = __WEBPACK_IMPORTED_MODULE_3_antd__["J" /* Typography */].Title;

var App = function (_React$Component) {
    _inherits(App, _React$Component);

    function App(props) {
        _classCallCheck(this, App);

        var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

        _this.handleSearchForm = function (criteria) {
            _this.componentTable.handleSearchForm(criteria);
        };

        _this.handleOpenModal = function (certificateid) {
            _this.setState({ certificateid: certificateid, visible: true });
        };

        _this.handleCancel = function () {
            _this.setState({ visible: false, titlepage: 'Verify New' });
        };

        _this.handleOk = function () {
            _this.setState({ visible: false }, _this.componentTable.getList());
        };

        _this.setTitlePage = function (titlepage) {
            _this.setState({ titlepage: titlepage });
        };

        _this.state = {
            visible: false,
            titlepage: 'Verify New'
        };
        return _this;
    }

    _createClass(App, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            document.title = "Manage Voucher | Loyalty Management System";
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _props = this.props,
                menucode = _props.menucode,
                prefixmenuname = _props.prefixmenuname;
            var _state = this.state,
                visible = _state.visible,
                titlepage = _state.titlepage,
                certificateid = _state.certificateid;

            var partner = Object(__WEBPACK_IMPORTED_MODULE_5__utilities_AuthService__["b" /* getProfile */])().partnercode;
            var configurationTable = {
                url: __WEBPACK_IMPORTED_MODULE_1__config_Services__["a" /* api */].url.redemptioncertificate.list,
                criteria: { partner: partner, status: 'VOUCHER_REDEEM' },
                columns: [{
                    type: 'field', title: 'Issued Date', dataIndex: 'issueddate', sorter: true,
                    render: function render(value, row, index) {
                        return value ? __WEBPACK_IMPORTED_MODULE_6_moment___default()(value).format('DD/MM/YYYY') : '-';
                    }
                }, {
                    type: 'field', title: 'Redeem Date', dataIndex: 'redeemdate', sorter: true,
                    render: function render(value, row, index) {
                        return value ? __WEBPACK_IMPORTED_MODULE_6_moment___default()(value).format('DD/MM/YYYY') : '-';
                    }
                }, { type: 'field', title: 'Certificate ID', dataIndex: 'certificateid', sorter: true }, { type: 'field', title: 'Partner', dataIndex: 'partner', sorter: true }, {
                    type: 'field', title: 'Status', dataIndex: 'status', sorter: true,
                    render: function render(value, row, index) {
                        return value ? Object(__WEBPACK_IMPORTED_MODULE_4__utilities_Helpers__["e" /* jsUcfirst */])(value, "_") : '-';
                    }
                }, {
                    type: 'html', title: 'Action', dataIndex: 'action',
                    render: function render(value, row, index) {
                        return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                            'span',
                            {
                                __source: {
                                    fileName: _jsxFileName,
                                    lineNumber: 71
                                },
                                __self: _this2
                            },
                            __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__components_Base_BaseComponent__["g" /* Button */], { htmlType: 'button', size: 'small', icon: 'eye', title: 'View', onClick: function onClick() {
                                    return _this2.handleOpenModal(row.certificateid);
                                }, __source: {
                                    fileName: _jsxFileName,
                                    lineNumber: 72
                                },
                                __self: _this2
                            })
                        );
                    }
                }]
            };

            var configurationSearchForm = [{ labeltext: "Issued Date", datafield: "issueddate", type: 'datepicker', placeholder: 'Issued Date', showDefaultSearch: true }, { labeltext: "Redeem Date", datafield: "redeemdate", type: 'datepicker', placeholder: 'Redeem Date', showDefaultSearch: true }, { labeltext: "Certificate ID", datafield: "certificateid", type: 'text', placeholder: 'Certificate ID', showDefaultSearch: true }];

            return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.Fragment,
                {
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 87
                    },
                    __self: this
                },
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_3_antd__["u" /* Modal */],
                    { title: titlepage + ' Voucher', visible: visible, onCancel: this.handleCancel, destroyOnClose: true, footer: null, width: 860, __source: {
                            fileName: _jsxFileName,
                            lineNumber: 88
                        },
                        __self: this
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_7__Form__["a" /* default */], { certificateid: certificateid, setTitlePage: this.setTitlePage, closemodalrefresh: this.handleOk, cancelModal: this.handleCancel, __source: {
                            fileName: _jsxFileName,
                            lineNumber: 89
                        },
                        __self: this
                    })
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                    __WEBPACK_IMPORTED_MODULE_3_antd__["A" /* Row */],
                    {
                        __source: {
                            fileName: _jsxFileName,
                            lineNumber: 91
                        },
                        __self: this
                    },
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        __WEBPACK_IMPORTED_MODULE_3_antd__["h" /* Col */],
                        { xs: 24, xl: 21, __source: {
                                fileName: _jsxFileName,
                                lineNumber: 92
                            },
                            __self: this
                        },
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                            Title,
                            { level: 3, __source: {
                                    fileName: _jsxFileName,
                                    lineNumber: 93
                                },
                                __self: this
                            },
                            'Manage Voucher'
                        )
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
                        __WEBPACK_IMPORTED_MODULE_3_antd__["h" /* Col */],
                        { xs: 24, xl: 3, __source: {
                                fileName: _jsxFileName,
                                lineNumber: 95
                            },
                            __self: this
                        },
                        __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__components_Base_BaseComponent__["g" /* Button */], { htmlType: 'button', type: 'primary', size: 'default', label: 'Verify New Voucher', menucode: menucode, prefixmenuname: prefixmenuname, actioncode: 'CREATE', onClick: function onClick() {
                                return _this2.handleOpenModal();
                            }, __source: {
                                fileName: _jsxFileName,
                                lineNumber: 96
                            },
                            __self: this
                        })
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3_antd__["k" /* Divider */], {
                        __source: {
                            fileName: _jsxFileName,
                            lineNumber: 98
                        },
                        __self: this
                    })
                ),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__components_Base_BaseComponent__["X" /* SearchForm */], { form: this.props.form, showAdvanceSearch: false, optionsConfiguration: configurationSearchForm, onSubmit: this.handleSearchForm, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 100
                    },
                    __self: this
                }),
                __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2__components_Base_BaseComponent__["_3" /* TableBase */], { ref: function ref(e) {
                        _this2.componentTable = e;
                    }, configuration: configurationTable, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 101
                    },
                    __self: this
                })
            );
        }
    }]);

    return App;
}(__WEBPACK_IMPORTED_MODULE_0_react___default.a.Component);

/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_3_antd__["n" /* Form */].create()(App));

/***/ })

});
//# sourceMappingURL=51.chunk.js.map