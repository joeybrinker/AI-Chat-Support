"use client"

import { Box, Button, Stack, TextField, styled } from '@mui/material'
import {useState} from 'react'

// Create a custom-styled TextField
const CustomTextField = styled(TextField)({
  '& label': {
    color: '#e5ffe4', // label color
  },
  '& label.Mui-focused': {
    color: '#e5ffe4', // label color when focused
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#e5ffe4', // outline color
    },
    '&:hover fieldset': {
      borderColor: '#e5ffe4', // outline color on hover
    },
    '&.Mui-focused fieldset': {
      borderColor: '#e5ffe4', // outline color when focused
    },
    color: '#e5ffe4', // text color
  },
  '& .MuiInputBase-input': {
    color: '#e5ffe4', // input text color
  },
});

export default function Home() {

  const [messages, setMessages] = useState([
    {
      role: 'assistant', 
      content: "Hello, I'm TeeMe's friendly and knowledgeable customer support assistant. How can I help you today?",
    },
  ])
  
  const [message, setMessage] = useState('')

  const sendMessage = async () => { 
    setMessage('')
    setMessages((messages) => [
      ...messages, 
      { role: 'user', content: message },
      {role: 'assistant', content:''},
    ])
    const response = await fetch('/api/chat', {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify([...messages, { role: 'user', content: message }]),
    }).then(async (res) => {
      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      let result = ''
      return reader.read().then(function processText({ done, value }) {
        if (done) {
          return result
        }
        const text = decoder.decode(value || new Int8Array(), { stream: true })
        setMessages((messages)=>{
          let lastMessage = messages[messages.length - 1]
          let otherMessages = messages.slice(0, messages.length - 1)
          return [
            ...otherMessages,
            {
              ...lastMessage,
              content: lastMessage.content + text,
            },
          ]
        })
        return reader.read().then(processText)
      })
    })
  }

  return (
  <Box
    width="100vw"
    height="100vh"
    display="flex"
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
    
    >
      <Stack 
        direction={"column"} 
        width = "600px" 
        height={"700px"} 
        border= "1px solid black" 
        p={2}
        spacing={2} 
        bgcolor={"#0e5d24"}
        borderRadius={4}
      >
        <Stack direction={"column"} spacing={2} flexGrow={1} overflow= "auto" maxHeight={"100%"}>
          {
            messages.map((message, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent={message.role === 'assistant' ? 'flex-start' : 'flex-end'}
                
              >
                  <Box
                    bgcolor={message.role === 'assistant' ? '#258a22' : '#e5ffe4'} // Custom colors
                    color={message.role === 'assistant' ? '#e5ffe4' : '#258a22'}  // Custom text colors
                    borderRadius={16}
                    p={3}
                  >
                      {message.content}
                  </Box>
              </Box>
            ))
          }
        </Stack>
        <Stack direction={"row"} spacing={2}>
        <CustomTextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                sendMessage();
              }
            }}
          />

          <Button
            variant="contained"
            sx={{
              backgroundColor: '#258a22', // Dark green background color
              color: '#ffffff', // White text color
              '&:hover': {
                backgroundColor: '#e5ffe4', // Darker green on hover
                color: "#258a22", // Dark green text color on hover
              },
            }}
            onClick={sendMessage}
          >
            Send
          </Button>

        </Stack>
      </Stack>

    </Box>
  )
}
