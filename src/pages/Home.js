// 'rfce'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

function Home() {
    const navigate = useNavigate();
    const [roomId,setRoomId] = useState('');
    const [username,setUsername] = useState('');

    const createNewRoom = (e) =>{
        e.preventDefault();

        const id = uuidv4();
        // console.log(id);
        setRoomId(id);

        toast.success('Created a new room');
    }

    const joinRoom = () =>{
        if(!roomId || !username){
            toast.error('ROOM ID & username is required');
            return;
        }

        // redirect
        navigate(`/editor/${roomId}`,{
            // to pass data from one route to another using navigate, use state object as below

            // we want to use username on editor page to show icon of user
            state: {
                username,
            }
        })
    }

    const handleInputEnter = (e) => {
        // console.log('event',e.code);
        if(e.code === 'Enter'){
            joinRoom();
        }
    }

  return (
    <div className='homePageWrapper'>
        <div className='formWrapper'>
            <img className='homePageLogo' src="https://raw.githubusercontent.com/codersgyan/realtime-code-editor/main/public/code-sync.png" alt="code-collaborator-logo" />
            {/* <img src="/code.png" alt="code-collaborator-logo" /> */}
            <h4 className='mainLabel'>Paste invitation ROOM ID</h4>
            <div className='inputGroup'>
                <input type="text" className='inputBox' placeholder='ROOM ID' value={roomId} onChange={(e) => setRoomId(e.target.value)} onKeyUp={handleInputEnter}/>
                <input type="text" className='inputBox' placeholder='USERNAME' value={username} onChange={(e) => setUsername(e.target.value)} onKeyUp={handleInputEnter} />
                <button className='btn joinBtn' onClick={joinRoom}>Join</button>
                <span className='createInfo'>
                    If you don't have an invite, create &nbsp; 
                    <a onClick={createNewRoom} href="" className='createNewBtn'>new room</a>
                </span>
            </div>
        </div>

        <footer>
            <h4>Built with 💛 by <a href="https://github.com/brijeshvp">Brijesh Peshvani</a></h4>
        </footer>
    </div>
  )
}

export default Home