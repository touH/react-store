import React from "react";
import { connect } from 'react-redux'

import { Input, Button, List, Card, Popconfirm, Modal } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

let id = 0;
class ReduxComponent extends React.Component {
  state = {
    id: 0,
    value: '',
    visible: false,
    modalValue: ''
  };

  componentDidMount() {
    const { getAllData } = this.props;
    getAllData();
  };

  handleChange = (e) => {
    this.setState({
      value: e.target.value
    })
  };

  handleClick = () => {
    const { value } = this.state;
    if(value === "") return;
    const { addData } = this.props;
    addData({
      id: ++id,
      value
    });
    this.setState({
      id,
      value: ''
    })
  };

  handleModalChange = (e) => {
    this.setState({
      modalValue: e.target.value
    })
  };

  handleOk = () => {
    const { id, modalValue: value } = this.state;
    const { editData } = this.props;
    editData({id, value });
    this.setState({
      modalValue: '',
      visible: false
    })
  };

  handleEdit = (row) => {
    this.setState({
      visible: true,
      id: row.id,
    })
  };

  handleDelete = (row) => {
    const { deleteData } = this.props;
    deleteData(row.id)
  };

  render() {
    return (
      <div>
        <Input style={{ width: '200px', marginRight: '15px' }} onChange={this.handleChange} value={this.state.value} />
        <Button type="primary" onClick={this.handleClick}>ADD</Button>
        <p style={{ marginTop: '10px' }}>值： { this.state.value }</p>
        <List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 4,
            lg: 4,
            xl: 6,
            xxl: 3,
          }}
          dataSource={this.props.list}
          renderItem={item => (
            <List.Item>
              <Card
                title={`id: ${item.id}`}
                actions={[
                  <EditOutlined key="edit" onClick={() => this.handleEdit(item)} />,
                  <Popconfirm
                    title="你确定要删除吗?"
                    onConfirm={() => this.handleDelete(item)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <DeleteOutlined key="delete" />
                  </Popconfirm>
                ]}
              >
                { item.value }
              </Card>
            </List.Item>
          )}
        />
        <Modal
          title="Basic Modal"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={() => {
            this.setState({
              visible: false,
              modalValue: ''
            });
          }}
        >
          <Input onChange={this.handleModalChange} value={this.state.modalValue} />
        </Modal>
      </div>
    );
  }
}

export default connect((state, ownProps) => {
  return {
    list: state.reduxReducer
  }
}, (dispatch, ownProps) => {
  return {
    getAllData() {
      dispatch({
        type: 'GET_ALL_DATA'
      })
    },
    addData(params) {
      dispatch({
        type: 'ADD_DATA',
        params
      })
    },
    editData(params) {
      dispatch({
        type: 'EDIT_DATA',
        params
      })
    },
    deleteData(id) {
      dispatch({
        type: 'DELETE_DATA',
        id
      })
    }
  }
})(ReduxComponent)
