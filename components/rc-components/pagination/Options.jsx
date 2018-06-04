import React from 'react';
import PropTypes from 'prop-types';
import KEYCODE from './KeyCode';

const BUILT_IN_PLACEMENTS = {
  bottomLeft: {
    points: ['tl', 'tl'],
    offset: [0, 0],
    overflow: {
      adjustX: 0,
      adjustY: 1,
    },
  },
  topLeft: {
    points: ['bl', 'tl'],
    offset: [0, -4],
    overflow: {
      adjustX: 0,
      adjustY: 1,
    },
  },
  bottomRight: {
    points: ['tr', 'br'],
    offset: [0, 4],
    overflow: {
      adjustX: 0,
      adjustY: 1,
    },
  },
};

class Options extends React.Component {
  static propTypes = {
    changeSize: PropTypes.func,
    quickGo: PropTypes.func,
    selectComponentClass: PropTypes.func,
    current: PropTypes.number,
    pageSizeOptions: PropTypes.arrayOf(PropTypes.string),
    pageSize: PropTypes.number,
    buildOptionText: PropTypes.func,
    locale: PropTypes.object,
  };

  static defaultProps = {
    pageSizeOptions: ['10', '20', '30', '40'],
  };

  constructor(props) {
    super(props);

    this.state = {
      current: props.current,
      goInputText: '',
    };
  }

  buildOptionText = (value) => {
    return `${value} ${this.props.locale.items_per_page}`;
  };

  changeSize = (value) => {
    this.props.changeSize(Number(value));
  };

  handleChange = (e) => {
    this.setState({
      goInputText: e.target.value,
    });
  };

  go = (e) => {
    let val = this.state.goInputText;
    if (val === '') {
      return;
    }
    val = Number(val);
    if (isNaN(val)) {
      val = this.state.current;
    }
    if (e.keyCode === KEYCODE.ENTER || e.type === 'click') {
      this.setState({
        goInputText: '',
        current: this.props.quickGo(val),
      });
    }
  };

  render() {
    const props = this.props;
    const state = this.state;
    const locale = props.locale;
    const prefixCls = `${props.rootPrefixCls}-options`;
    const changeSize = props.changeSize;
    const quickGo = props.quickGo;
    const goButton = props.goButton;
    const buildOptionText = props.buildOptionText || this.buildOptionText;
    const Select = props.selectComponentClass;
    let changeSelect = null;
    let goInput = null;
    let gotoButton = null;
    let label = null;

    if (!(changeSize || quickGo)) {
      return null;
    }

    if (changeSize && Select) {
      const Option = Select.Option;
      const pageSize = props.pageSize || props.pageSizeOptions[0];
      const options = props.pageSizeOptions.map((opt, i) => (
        <Option key={i} value={opt}>{buildOptionText(opt)}</Option>
      ));

      changeSelect = (
        <Select
          prefixCls={props.selectPrefixCls}
          showSearch={false}
          className={`${prefixCls}-size-changer`}
          optionLabelProp="children"
          dropdownMatchSelectWidth={false}
          value={pageSize.toString()}
          onChange={this.changeSize}
          builtinPlacements={BUILT_IN_PLACEMENTS}
          getPopupContainer={triggerNode => triggerNode.parentNode}
        >
          {options}
        </Select>
      );
    }

    if (quickGo) {
      if (goButton) {
        if (typeof goButton === 'boolean') {
          gotoButton = (
            <button
              type="button"
              onClick={this.go}
              onKeyUp={this.go}
            >
              {locale.jump_to_confirm}
            </button>
          );
        } else {
          gotoButton = (
            <span
              onClick={this.go}
              onKeyUp={this.go}
            >{goButton}</span>
          );
        }
      }
      goInput = (
        <div className={`${prefixCls}-quick-jumper`}>
          {locale.jump_to}
          <input
            type="text"
            value={state.goInputText}
            onChange={this.handleChange}
            onKeyUp={this.go}
          />
          {locale.page}
          {gotoButton}
        </div>
      );
    }

    if (props.changeSizeLabel) {
      label = (
        <span className={`${prefixCls}-label`}>
        {locale.label_items_per_page}
        </span>
      );
    }

    return (
      <li className={`${prefixCls}`}>
        {label}
        {changeSelect}
        {goInput}
      </li>
    );
  }
}

export default Options;