import react,{useState}from 'react';

const CustomerForm1=({onCustomerSubmit})=>{
const[form,setForm]=useState({
    name:"",
    email:"",
    Phone:""
});
const handleChange=e=>{
    setForm({...form,[e.target.name]:
        e.target.value
    });
};

const handleSubmit=e=>{
e.preventDefault();
onCustomerSubmit(form);

};


return(

    <form onSubmit={handleSubmit}>
<h1>Please enter ur details</h1>
<label>Name</label>
<input type="text" name="name" onChange={handleChange} required/>
<label>Email</label>

<input type="email" name="email" onChange={handleChange} required/>
<label>address</label>

<input type="text" name="address" onChange={handleChange} required/>
        <button type="submit">Next</button>
    </form>
)

}
export default CustomerForm1;