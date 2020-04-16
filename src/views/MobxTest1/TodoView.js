import React from "react";
import { Button } from 'antd'
import { inject } from 'mobx-react'

@inject('store')
class TodoView extends React.Component {

  handleClick = () => {
    const { id, store } = this.props;
    store.todoStroe.deleteTodo(id);
  };

  render() {
    const { value } = this.props;
    return <div style={{ margin: '10px' }}>
      <span style={{ marginRight: '20px' }}>{ value }</span>
      <Button type="primary" onClick={this.handleClick}>完成</Button>
    </div>
  }
}

export default TodoView;
