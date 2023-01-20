// 'rfce'
import React, { useState } from 'react'
import { useEffect } from 'react';
import { useRef } from 'react';
import { toast } from 'react-hot-toast';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import ACTIONS from '../Actions';
import Client from '../components/Client';
import Editor from '../components/Editor';
import { initSocket } from '../socket';

function EditorPage() {
  const socketRef = useRef(null);
  const location = useLocation();
  const reactNavigator  = useNavigate();
  const codeRef = useRef(null);

  const [clients,setClients] = useState([]);

  // get roomId from url parameter
  const {roomId} = useParams();

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      
      function handleErrors(e){
        console.log('socket error',e);
        toast.error('Socket connection failed, try again later.');
        reactNavigator('/');
      }
      
      socketRef.current.on('connect_error',(err)=> handleErrors(err));
      socketRef.current.on('connect_failed',(err)=> handleErrors(err));

      socketRef.current.emit(ACTIONS.JOIN,{
        roomId,
        username: location.state?.username,
      });

      // Listening for joined event
      socketRef.current.on(ACTIONS.JOINED,({clients,username,socketId})=>{
        if(username!== location.state?.username){
          toast.success(`${username} joined the room.`);
          console.log(`${username} joined`);
        }

        setClients(clients);
        socketRef.current.emit(ACTIONS.SYNC_CODE,{
          code: codeRef.current,
          socketId,
        });
      })

      // listening for disconnected
      socketRef.current.on(ACTIONS.DISCONNECTED,({socketId,username}) => {
        toast.success(`${username} left the room.`);
        setClients((prev) => {
          return prev.filter(client => client.socketId !== socketId);
        })
      })
    }
    init();
    // clear listeners -> in cleaning function
    return () => {
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
      socketRef.current.disconnect();
    }
  },[]);

 async function copyRoomId(){
  try{
    await navigator.clipboard.writeText(roomId);
    toast.success(`Room ID has been copied to your clipboard`);
  }
  catch(err){
    toast.error(`Could not copy the Room ID`);
    console.log(err);
  }
 }

 function leaveRoom(){
  reactNavigator('/');
 }

if(!location.state){
  return <Navigate to="/" />
}
  return (
    <div className='mainWrap'>
      <div className='aside'>
        <div className='asideInner'>
          {/* logo */}
          <div className='logo'>
          <img className='logoImage' src="https://raw.githubusercontent.com/codersgyan/realtime-code-editor/main/public/code-sync.png" alt="code-collaborator-logo" />

          {/* users */}
          </div>
          <h3>Connected</h3>
          <div className='clientsList'>
            {
              clients.map((client) => (
                <Client key={client.socketId} username={client.username} />
              ))
            }
          </div>
        </div>

        <button className='btn copyBtn' onClick={copyRoomId}>Copy ROOM ID</button>
        <button className='btn leaveBtn' onClick={leaveRoom}>Leave</button>

      </div>
      <div className='editorWrap'>
        <Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code) => {
          codeRef.current = code;
        }} />
      </div>
    </div>
  )
}

export default EditorPage