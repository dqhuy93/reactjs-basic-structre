import React, { Component } from 'react';
import { connect } from 'react-redux';
import { mockApiDelay } from '../../actions';
import debounce from 'lodash.debounce';
import axios from 'axios';
import { Input, Spin } from 'antd';

import './home.scss';

// https://reactjs.org/docs/faq-functions.html#debounce
// https://github.com/axios/axios#cancellation

class Home extends Component {
  constructor(props) {
    super(props);

    // hoãn thời gian 200ms,
    // khi user gõ phím (khoảng cách giữa 2 lần gõ liên tục < 200ms) thì sẽ ko excute function this.emitChange
    // ngược lại thì excute function this.emitChange
    this.emitChangeDebounced = debounce(this.emitChange, 200);

    this.state = {
      userDetail: null,
      isLoading: false,
    };
  }

  componentWillUnmount() {
    // hủy debounce (ko thực thi hàm this.emitChange nếu như trong thời gian api pending mà user rời khỏi component)
    this.emitChangeDebounced.cancel();

    // hủy request nếu như trong thời gian api pending mà user rời khỏi component
    this.signal.cancel('Canceled');
  }

  handleChange = (e) => {
    // hủy request đang nếu như đang pending
    if (this.signal) {
      this.signal.cancel('Canceled');
    }

    // tạo token mới cho request tiếp theo
    this.signal = axios.CancelToken.source();

    // emit debounce change
    this.emitChangeDebounced(e.target.value);
  };

  emitChange = async (value) => {
    // console.log(value);
    try {
      // show loading
      this.setState({
        isLoading: true,
      });

      // pass value và tokenCancel vào hàm mockApiDelay
      const response = await mockApiDelay(value, this.signal.token);

      // nếu kết quả thành công thì setState
      if (response && response.data) {
        this.setState({
          userDetail: response.data,
        });
      }
    } catch (error) {}

    // hide loading
    this.setState({
      isLoading: false,
    });
  };

  render() {
    const { userDetail, isLoading } = this.state;
    return (
      <div className="demo">
        <h1>This is Home Page</h1>
        <h2>Example call API</h2>
        <Input onChange={this.handleChange} />
        <br />
        <br />
        <Spin spinning={isLoading} size="large" />
        <br />
        {userDetail ? (
          <pre style={{ background: '#CCC', padding: 10 }}>
            {JSON.stringify(userDetail, null, 2)}
          </pre>
        ) : null}

        <br />
      </div>
    );
  }
}

export default connect(null, null)(Home);
