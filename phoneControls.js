class PhoneControls{
    constructor(canvas){
        this.tilt = 0;
        this.canvas = canvas;
        this.forward = false;
        this.reverse = false;
        this.canvasAngle = 0
        
        this.#addEventListeners();
    }
    #addEventListeners(){
        /*window.addEventListener('deviceorientation', (e) => {
            this.tilt = e.beta * Math.PI / 180;
            const canvasAngle = -this.tilt;
            this.canvas.style.transform = `translate(-50%, -50%) rotate(${canvasAngle}rad)`;


        });*/

        window.addEventListener('devicemotion', (e) => {
            this.tilt = Math.atan2(
                e.accelerationIncludingGravity.x,
                e.accelerationIncludingGravity.y
            );
            const newCanvasAngle = -this.tilt;
            this.canvasAngle = this.canvasAngle * 0.6 + newCanvasAngle * 0.4;
            this.canvas.style.transform = `translate(-50%, -50%) rotate(${this.canvasAngle}rad)`;


        });
        window.addEventListener('touchstart', (e)=>{
            this.forward = true;
            this.reverse = false;

        });
        window.addEventListener('touchend', (e)=>{
            this.forward = false;
            this.reverse = true;
        });

        document.addEventListener("click", ()=>{
            if(document.body.requestFullscreen){
                document.body.requestFullscreen();
            }
            else if(document.body.webkitRequestFullscreen){
                document.body.webkitRequestFullscreen();
            }
            else if(document.body.mozRequestFullscreen){
                document.body.mozRequestFullscreen();
            }
            else if(document.body.msRequestFullscreen){
                document.body.msRequestFullscreen();
            }
        })
    }
}