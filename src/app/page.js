"use client"
import { useEffect, useState,useRef } from 'react';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import loadingImg from '@/app/media/loading.gif';
import Image from 'next/image';
const MODEL_NAME = "gemini-1.0-pro";
const API_KEY = "AIzaSyDZTMBjPl4ASKQYNywGwCt_v7WVWvZ1Xzk";
import Mode from '@/app/components/darkMode/Mode';

export default function Home()  {
 
  
  const [hydr, setHydr] = useState(false);
  const [responseText, setResponseText] = useState("hi");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const [messageHistory, setMessageHistory] = useState(() => {
    // Retrieve the value from localStorage or use a default value
    if (typeof window !== 'undefined') {
      const storedMessages = localStorage.getItem('messagelocal');
      return storedMessages !== null ? JSON.parse(storedMessages) : [];
    }
    return [];
  });
  const isMsgEmpty = msg.trim() === "";
 

  
  
  
  useEffect(() => {
    setHydr(true);
   
  }, []);
  
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('messagelocal', JSON.stringify(messageHistory))
    }
  }, [messageHistory]);

  const formatCodeText = (text) => {
    const codeRegex = /```(.*?)```/gs;
    return text.replace(codeRegex, (match, p1) => `<code class="codeblock">${p1}</code>`);
  };

  const formatBoldText = (text) => {
    const boldRegex = /\*\*(.*?)\*\*/g;
    const escapedText = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return formatCodeText(escapedText.replace(boldRegex, (match, p1) => `<strong>${p1}</strong>`));
  };

  const  CopyToClipbored = async (textcopy) => {
    try{
          await navigator.clipboard.writeText(textcopy)

    }catch(error){
        console.error(e);
    }
  }
  try {
    
  } catch (error) {
    
  }
  
  const runChat = async () => {
    setLoading(true);

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
      temperature: 0.8,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    };

    const safetySettings = [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    ];
    setMessageHistory(prev => [...prev, { text: msg, role: "user" }]);

    const chat = model.startChat({ generationConfig, safetySettings });
    setMsg("");
   
      const result = await chat.sendMessage(msg);
    const response = result.response;
    setMessageHistory(prev => [...prev, { text: response.text(), role: "model" }]);
    setResponseText(response.text());
   
    

    setLoading(false);
  }

  const hundlerclick = (event) =>{
    if(event.key == 'Enter'){

      runChat();
    }
  }
  const boxRef = useRef(null);

  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }
  }, [messageHistory]);
  return (
    <main>
      <div className='navbar'>
        <p>AuzaWeb <small>ai</small></p>
        <Mode  />
      </div>
      
      <div className='result' ref={boxRef} >
        
     
        {loading ? (
          <Image src={loadingImg} width={200} height={200} alt="Loading..." />
        ) : responseText && hydr && (
          <div className='reponse'>
            {messageHistory.map((message, index) => (
              <div className='output' key={index} >
                <button key={index} className={message.role === "user" ? 'btncopy hidden' : `btncopy transition ease-out duration-300  `} title='copy' onClick={() => CopyToClipbored(message.text)}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#d8dbe0" className="w-7 h-7">
                    <path fillRule="evenodd" d="M10.5 3A1.501 1.501 0 0 0 9 4.5h6A1.5 1.5 0 0 0 13.5 3h-3Zm-2.693.178A3 3 0 0 1 10.5 1.5h3a3 3 0 0 1 2.694 1.678c.497.042.992.092 1.486.15 1.497.173 2.57 1.46 2.57 2.929V19.5a3 3 0 0 1-3 3H6.75a3 3 0 0 1-3-3V6.257c0-1.47 1.073-2.756 2.57-2.93.493-.057.989-.107 1.487-.15Z" clipRule="evenodd" />
                  </svg>
                </button>
                <strong>
                  {message.role === "user" ?
                    <div className='profile'><div>s</div><p>You</p></div> : <div className='GenAI'><div ><p>Ai</p></div><p>GenAI</p></div>
                  }
                </strong>
                <pre className='pre' dangerouslySetInnerHTML={{ __html: formatBoldText(message.text) }}>
                  {/* <button>copy this</button> */}
                </pre>
              </div>
            ))}
          </div>
        )}
 
      </div>

      <section>
        <input type='text' value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={hundlerclick} placeholder='Write a Message ...' />
        <button onClick={runChat} disabled={isMsgEmpty} >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 18.75 7.5-7.5 7.5 7.5" />
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 7.5-7.5 7.5 7.5" />
          </svg>
        </button>
      </section>
    </main>
  );
}




