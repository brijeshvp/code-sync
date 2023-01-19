// 'rfce'
import React, { useState } from 'react'
import Client from '../components/Client';
import Editor from '../components/Editor';

function EditorPage() {
  const [clients,setClients] = useState([
    {socketId: 1, username: 'Brijesh Peshvani'},
    {socketId: 2, username: 'John Doe'},
]);
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

        <button className='btn copyBtn'>Copy ROOM ID</button>
        <button className='btn leaveBtn'>Leave</button>

      </div>
      <div className='editorWrap'>
        <Editor />
      </div>
    </div>
  )
}

export default EditorPage