const CustomAlert = {

    state : {
        success : 0, error : 1, info : 2,
    },

    show : function(msg, alertState)  {
        const alertBox = document.createElement('div');
        switch(alertState){
            case this.state.success : 
                alertBox.style.background = 'green';
                break;
            case this.state.error : 
                alertBox.style.background = 'red';
                break;
            case this.state.info : 
                alertBox.style.background = 'blue';
                break;
            default :
                alertBox.style.background = 'gray';
        }
        alertBox.style.color = 'white';
        alertBox.style.padding = '1rem';
        alertBox.style.position = 'fixed';
        alertBox.style.top = '10px';
        alertBox.style.right = '10px';
        alertBox.style.borderRadius = '10px';
        alertBox.innerText = msg;
        document.body.appendChild(alertBox);
        setTimeout(()=>$(alertBox).fadeOut(2000), 1000);
    }
}
export default CustomAlert;