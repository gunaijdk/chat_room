import React from 'react';
import { useEffect,useState } from 'react';
import "./ChatRoom.css"
import useSWR from 'swr';
import { RoomListRes } from "./types";
import { getFetcher } from './fetcher.ts';
interface RoomEntryProps {
  isActive:boolean;
  roomId: number;
  room: {
    roomName: string;
    lastMessage?: {
      content: string;
      time: number;
    };
  };
  onRoomClick:(roomId:number,room:RoomEntryProps['room'])=>void
}

interface MessageProps {
  message: {
    sender: string;
    content: string;
    time: number;
  };
}

// RoomEntry 组件
function RoomEntry(props: RoomEntryProps) {
  // 定义选中和未选中房间的颜色
  const activeRoomColor = '#d9d9d9'; // 被点击的房间颜色
  const inactiveRoomColor = '#ffffff'; // 未被点击的房间颜色

  // 根据房间是否被选中来设置颜色
  const roomColor = props.isActive ? activeRoomColor : inactiveRoomColor;
  const handleDeleteRoom = async () => {
    if (window.confirm('Are you sure you want to delete this room?')) { // 确认对话框
      try {
        const response = await fetch(`/api/room/delete?roomId=${props.roomId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user: 'currentUser' }), // 替换为当前用户的实际用户名
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        console.log('Room deleted:', props.roomId);
        // 这里可以添加逻辑来更新房间列表
        // mutate('/api/room/list');
      } catch (error) {
        console.error('Failed to delete room:', error);
      }
    }
  };
  return (
    <div
      className="room-entry"
      style={{ backgroundColor: roomColor }}
      onClick={() => props.onRoomClick(props.roomId, props.room)}
    >
      <div className="room-icon" style={{ backgroundColor: roomColor, width: "30px", height: "30px", borderRadius: "50%" }} />
      <div className="room-info">
        <div className="room-name">{props.room.roomName}</div>
        <div className="last-chat-time">
          {props.room.lastMessage ? new Date(props.room.lastMessage.time).toLocaleTimeString() : 'No activity'}
        </div>
      </div>
      <button onClick={handleDeleteRoom} className="delete-room-btn">Delete</button> {/* 删除按钮 */}
    </div>
  );
}

// MessageItem 组件
function MessageItem(props: MessageProps) {
  return (
    <div className="message-item">
      <img src="message-icon.svg" alt="Message Icon" />
      <div className="message-info">
        <div className="sender-name">{props.message.sender}</div>
        <div className="message-content">{props.message.content}</div>
        <div className="message-time">{new Date(props.message.time).toLocaleTimeString()}</div>
      </div>
    </div>
  );
}

// 更新后的假设房间数据
const mockRooms = [
  {
    roomId: 1,
    roomName: 'General',
    lastMessage: {
      messageId: 1,
      sender: 'System',
      content: 'Welcome to the General channel!',
      time: Date.now(),
    },
  },
  {
    roomId: 2,
    roomName: 'Random',
    lastMessage: {
      messageId: 2,
      sender: 'Alice',
      content: 'This is a test message.',
      time: Date.now() - 3600000, // 1 hour ago
    },
  },
  {
    roomId: 3,
    roomName: 'Announcements',
    lastMessage: {
      messageId: 3,
      sender: 'Bob',
      content: 'Check out the new features!',
      time: Date.now() - 7200000, // 2 hours ago
    },
  },
  {
    roomId: 4,
    roomName: 'Support',
    lastMessage: {
      messageId: 4,
      sender: 'Charlie',
      content: 'Need help? Ask here!',
      time: Date.now() - 21600000, // 6 hours ago
    },
  },
  // 可以继续添加更多房间数据...
];

// 更新后的假设消息数据

// ChatRoom 组件
export default function ChatRoom() {
  const [selectedRoom, setSelectedRoom] = React.useState<RoomEntryProps | null>(null);
  const[inputValue,setInputValue]=useState<string>("");
  const[messages,setMessages] =useState<MessageProps[]>([]);
  const [showNewRoomInput, setShowNewRoomInput] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  
  //显示输入新房间名称框
  const handleToggleNewRoomInput = () => {
    setShowNewRoomInput(!showNewRoomInput);
  };
  //增加房间处理函数
  const handleAddRoom = async () => {
    if (!newRoomName) return; // 如果房间名为空，则不执行添加操作
  
    try {
      // 假设使用 fetch 发送 POST 请求到后端
      const response = await fetch('/api/room/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: 'currentUser', roomName: newRoomName }),
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
  
      // 假设后端返回新房间的数据
      const newRoomData = await response.json();
      console.log('Room added:', newRoomData);
  
      // 这里可以添加逻辑来更新房间列表
      
    } catch (error) {
      console.error('Failed to add room:', error);
    }
    handleToggleNewRoomInput();
  };
  //使用SWR获取房间列表
  const { data: roomListData } = useSWR<RoomListRes>(
    '/api/room/list',
    getFetcher
  );
  //使用SWR获取选中房间消息列表
  const { data, error } = useSWR<MessageProps[] | null>(
    selectedRoom ? `/api/room/message/list?roomId=${selectedRoom.roomId}` : null,
    getFetcher
  );

  // 定义 handleRoomClick 函数
  const handleRoomClick = (roomId: number, roomData:RoomEntryProps['room']) => {

    const roomEntryProps:RoomEntryProps={
      isActive:true,
      roomId,
      room:roomData,
      onRoomClick:handleRoomClick,
    };
    setSelectedRoom(roomEntryProps)
  };
  //更新房间列表
  useEffect(() => {
    // 如果房间列表数据更新，更新选中房间
    if (roomListData && roomListData.code === 200) { // 确保响应码为200
      const firstRoomData = roomListData.data.rooms[0];
      if (firstRoomData) {
        // 创建一个符合 RoomEntryProps 接口的对象
        const firstRoomEntry: RoomEntryProps = {
          isActive: false, // 假设初始状态为不活跃
          roomId: firstRoomData.roomId,
          room: firstRoomData, // 将 RoomData 对象赋值给 room 属性
          onRoomClick: handleRoomClick, // 确保 onRoomClick 函数被正确引用
        };
        setSelectedRoom(firstRoomEntry); // 更新选中房间状态
      }
    }
  }, [roomListData,handleRoomClick]);
   // 渲染消息列表的函数
   
  const renderMessages = () => {
    if (error) {
      if (error.message.includes('Unexpected token')) {
        return <div>Failed to load messages: Invalid JSON response</div>;
      }
      if (error.message.includes('HTTP error')) {
        return <div>Failed to load messages: HTTP error {error.message.split(': ')[1]}</div>;
      }
      return <div>Error: {error.message}</div>;
    }
    if (!data || data.length === 0) return <div>No messages</div>;

    // 渲染消息列表
    return data.map((message) => (
      <MessageItem key={`${message.message.sender}-${message.message.time}`} message={message.message} />
    ));
  };
  useEffect(()=>{
    const sortMockRooms= mockRooms.sort((a,b)=>{
      if(!a.lastMessage||!b.lastMessage) return 0;
      return b.lastMessage.time-a.lastMessage.time
    });
    console.log(sortMockRooms);
  },[]);
  const handleSendMessage =()=>{
    if (inputValue.trim()) {
      const newMessage: MessageProps = {
        message: {
          sender: 'You', // 假设当前用户是 "You"
          content: inputValue,
          time: Date.now(),
        },
      };
      setMessages([...messages, newMessage]); // 添加新消息到列表
      setInputValue(''); // 清空输入栏
    }
  };
  //获取聊天房间列表

  return (
    <div className="chat-room">
      <div className="sidebar" >
        <div className="sidebar-header">
          <div className="header-content">
            <span className='message-prompt'>消息：</span>
            <button className='new-room-btn' onClick={handleAddRoom}>{showNewRoomInput ? '取消' : '+'}</button>
          </div> 
        </div>
        <ul className="room-list">
         {mockRooms.map((room)=>(
         <RoomEntry
          roomId={room.roomId}
          room={room}
          onRoomClick={handleRoomClick}
          isActive={room.roomId === selectedRoom?.roomId}
        />
      ))}
        </ul>
      </div>
      {showNewRoomInput && (
        <div className="new-room-input">
          <input
            type="text"
            placeholder="Enter new room name"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
          />
          <button onClick={handleAddRoom}>Add Room</button>
        </div>
      )}
      <div className="chat-window">
        {selectedRoom && (
          <>
            <div className="chat-header">
              <img src="room-icon.svg" alt="Room Icon" />
              <h2>{selectedRoom.room.roomName}</h2>
            </div>
            <div className="message-list">
              {
                renderMessages()
              }
            </div>
            <div className='chat-input'>
              <input
                type="text"
                placeholder="请输入消息内容"
                value={inputValue}
                onChange={(e)=>setInputValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage(); }} 
                />
                <button onClick={handleSendMessage}>发送</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}