// SetName.tsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function SetName() {
  const navigate = useNavigate();
  const location = useLocation();
  const [nickname, setNickname] = useState('');

  // 如果从其他页面传递了state，那么在这里获取
  const { state } = location.state || {};

  const handleSetNickname = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // 可以在这里添加将昵称保存到本地存储或后端的逻辑(好吧看接口文档应该没有)
    console.log('Nickname set to:', nickname);

    // 假设我们有一个后端API来保存昵称，这里可以调用API（也没有）

    // 保存昵称后，跳转到聊天室页面
    navigate('/index', { replace: true });
  };

  return (
    <div className="set-name-page">
      <h1>设置昵称</h1>
      <form onSubmit={handleSetNickname}>
        <input
          type="text"
          placeholder="输入您的昵称"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
        />
        <button type="submit">设置昵称并进入</button>
      </form>
      {
        // 如果有从其他页面传递的state，也可以在这里展示
        state && <p>状态信息: {JSON.stringify(state)}</p>
      }
    </div>
  );
}

export default SetName;