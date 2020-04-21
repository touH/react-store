import React from "react";
import { observer, inject } from 'mobx-react';
import { Input, Button, List } from 'antd'
import './index.css'
import TodoView from './TodoView'

// inject参数为一个函数时，这个函数返回对象就是会被绑定到props上，可以直接store中取到相应的todoStroe返回
@inject((allStores, props, context) => {
  console.log(allStores, props, context)
  return {
    todoStroe: allStores.store.todoStroe
  }
})
@observer
class MobxTest1 extends React.Component {

  state = {
    input: ''
  };

  handleChange = (e) => {
    this.setState({
      input: e.target.value
    })
  };

  handleClick = () => {
    const { todoStroe } = this.props;
    todoStroe.addTodo(this.state.input);
    this.setState({
      input: ''
    })
  };

  handleReset = () => {
    const { todoStroe } = this.props;
    todoStroe.resetTodo();
  };

  render() {
    let { todoStroe } = this.props;
    return <div>
      <div className="todo-form">
        <Input style={{ width: '250px', marginRight: '30px' }} onChange={ this.handleChange } value={this.state.input} />
        <Button style={{ marginRight: '30px' }} type="primary" onClick={this.handleClick}>添加</Button>
        <Button type="primary" onClick={this.handleReset}>重置</Button>
      </div>
      <p>desc: { todoStroe.desc }</p>
      <div>
      <List
        size="large"
        bordered
        dataSource={todoStroe.todos}
        renderItem={todo => <TodoView key={todo.id} {...todo} />}
      />
      </div>
    </div>
  }
}

export default MobxTest1;
