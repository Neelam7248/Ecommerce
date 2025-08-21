import react,{useState} from 'react';
const GeminiForm=()=>{
const[prompt,setPrompt]=useState('');
const[response,setResponse]=useState('');
coonst[loading,setLoading]=useState(false);

const handleSubmit=async(e)=>{
    e.preventDefault();
    setLoading(true);
    setResponse('');

try{
const response=await fetch('/api/prompt',{
    method:"POST",
    header:{'Content-Type':'application/json'},
    body:JSON.stringify({prompt})

})
const result=await response.json();
if(!response.ok){
    setResponse(result.error,"server side error");
}setResponse(result.text||"no data is received");
setResponse(result.text||result.message)

}catch(error){
    setResponse("something went wrong pleae try again")
}finally{
    
}

    }
}
