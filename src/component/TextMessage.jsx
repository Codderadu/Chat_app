import React from "react";
import {Avatar, HStack,Text} from "@chakra-ui/react";
import "./TextMessage.css"

function TextMessage({text,uri,user="other"}) {
    
  return <HStack alignSelf={user==='me'?"flex-end":"flex-start"} bgColor={"gray.100"} padding={"2.5"} bg={"cream"} borderRadius={"base"} margin={"2"}>
       {
        user==="other"&& <Avatar src={uri} w={"30px" } h={"30px"}/>
       }
       <Text className="textBar">{text}</Text>
       {
        user==="me" && <Avatar src={uri} w={"30px" } h={"30px"}/>
       }
  </HStack>
}

export default TextMessage;
