import React from 'react';
import './index.less';
import { Button, Form, Input, InputNumber, Radio } from 'antd';
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import EditableTable from './components/EditableTable';
import EditableRowTable from './components/EditableRowTable';
import keyboardListen, { CLASSKEY, HANDLERSTATUS, combinationKey } from './keyboardListen.js';
import Drawer from './drawer';

type typeProps = any;
/** 接口 */
interface dataState {
  nameVisible: boolean,
  value: string,
  drawerVisible: boolean,
}

class Mine extends React.Component<typeProps, dataState> {
  keyboardListen: { destroy: () => void; };
  constructor(props: any) {
    super(props);
    this.state = {
      nameVisible: true,
      value: '',
      drawerVisible: false,
    };
  }

  componentDidMount() {
    console.log('index didmount');
    // 获取页面上需要监听回车的dom元素块
    const beforeHandler = (el: Element, status: number) => {
      switch (status) {
        case HANDLERSTATUS.NOTHING:
          return false;
          break;
        case HANDLERSTATUS.JUMPNEXT:
          if (el.classList.contains(CLASSKEY.JUMPNEXT)) {
            return true;
          }
          break;
        default:
          break;
      }
      return false;
    };
    const combinationHandler = (key: String) => {
      if (key === 'controlS') {
        this.setState({nameVisible: !this.state.nameVisible});
      } else if (key === 'metaF') {
        alert('拦截meta+F');
      } else {
        alert(key);
      }
    };
    this.keyboardListen = keyboardListen(beforeHandler,combinationHandler);
  }
  componentWillUnmount() {
    // 卸载解除监听事件
    this.keyboardListen.destroy();
  }

  render() {
    const clickHandler = (e: any) => {
      alert('新建(CTRL+N)');
    };
    return (
      <>
        <Form
          labelCol={{ span: 2 }}
          wrapperCol={{ span: 6 }}
          layout='horizontal'
          className={CLASSKEY.ENTER}
          style={{ background: '#ffffff'}}
        >
          <Form.Item label='年龄'>
            <InputNumber />
          </Form.Item>
          {this.state.nameVisible && (
            <Form.Item label='姓名'>
              <Input />
            </Form.Item>
          )}
          <Form.Item label='按钮'>
            <Button type='primary' onClick={() => this.setState({nameVisible: !this.state.nameVisible})}>{ !this.state.nameVisible? '显示(ctrl+s)' : '隐藏(ctrl+s)' }</Button>
          </Form.Item>
          <Form.Item label='日期'>
            {/* <DatePicker picker='date' /> */}
          </Form.Item>
          <Form.Item name='class' label='班级' wrapperCol={{ span: 2 }}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type='primary' disabled onClick={(e)=>clickHandler(e)}>新建(CTRL+N)</Button>
          </Form.Item>
          <Form.Item>
            <Button className={CLASSKEY.JUMPNEXT} type='primary'>跳过</Button>
          </Form.Item>
          <Form.Item label='级别'>
            <Radio.Group onChange={(e)=>this.setState({value: e.target.value})} value={this.state.value}>
              <Radio value={1}>A</Radio>
              <Radio value={2}>B</Radio>
              <Radio value={3}>C</Radio>
            </Radio.Group>
          </Form.Item>
          <Button type="primary" onClick={()=>this.setState({drawerVisible: true})}>
            弹窗
          </Button>
        </Form>
        <br />
        <Form
          layout='inline'
          className={CLASSKEY.ENTER}
          style={{ padding: 10, background: '#ffffff'}}
        >
          <Form.Item label='中国'>
            <InputNumber />
          </Form.Item>
          <Form.Item label='美国'>
            <Input />
          </Form.Item>
          <Form.Item label='日本'>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type='primary' onClick={(e) => alert(`新建(CTRL+N)`)}> <PlusOutlined /> 新建(CTRL+N)</Button>
          </Form.Item>
          <Form.Item label='韩国'>
            <Input placeholder="韩国" />
          </Form.Item>
        </Form>
        <br />
        <EditableRowTable />
        <EditableTable />
        <Drawer drawerVisible={this.state.drawerVisible} setDrawerVisible={(val)=>this.setState({drawerVisible: val})} />
      </>
    );
  }
}

export default Mine;