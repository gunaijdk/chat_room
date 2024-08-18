
// 定义响应类型
export interface RoomListRes {
    code: number;
    message: string;
    data: {
      rooms: RoomData[];
    };
  }
  
  interface RoomMessageListRes {
    code: number;
    message: string;
    data: {
      messages: MessageData[];
    };
  }
  
  // 定义房间数据结构
  interface RoomData {
    roomId: number;
    roomName: string;
    // 可以根据需要添加其他房间属性
  }
  
  // 定义消息数据结构
  interface MessageData {
    messageId: number;
    sender: string;
    content: string;
    time: number; // 时间戳
    // 可以根据需要添加其他消息属性
  }
  
  // 定义POST请求参数类型
  interface MessageAddArgs {
    user: string;
    roomName: string;
    // 可以根据需要添加其他参数
  }
  
  // 定义房间条目的属性
  interface RoomEntryProps {
    isActive: boolean;
    roomId: number;
    room: RoomData;
    onRoomClick: (roomId: number, room: RoomData) => void;
  }
  
  // 定义消息条目的属性
  interface MessageProps {
    message: MessageData;
  }
  
