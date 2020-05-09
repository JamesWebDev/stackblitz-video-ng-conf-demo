import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css']
})
export class CameraComponent implements OnInit {
  @ViewChild('localVideo') localVideo;
  @ViewChild('remoteVideo') remoteVideo;
  blur: boolean;
  sepia: boolean;
  invert: boolean;
  flip: boolean;
  isOfferer: boolean = false;
  peerConnection: any;
  configuration: any;
  localVideoElement: HTMLVideoElement;
  remoteVideoElement: HTMLVideoElement;

  message = 'MyChatRoom1'
  constructor() { }

  ngOnInit() {
    this.localVideoElement = this.localVideo.nativeElement;
    this.remoteVideoElement = this.remoteVideo.nativeElement;

    this.configuration = {
      iceServers: [{
        urls: 'stun:stun.l.google.com:19302' // Google's public STUN server
      }]
    };
  }

  onJoinClicked(){
    console.log('onJoinClicked called.')
    this.startWebRtc();
  }

  startWebRtc(){
    this.peerConnection = new RTCPeerConnection(this.configuration)
    this.peerConnection.onicecandidate = event => {
      console.log('onicecandidate');
      console.log(event)
    }
    if(this.isOfferer){
      this.peerConnection.onnegotiationneeded = () => {
        this.peerConnection.createOffer().then(this.onSuccess).catch(this.onError);
      }
    }
    // When a remote stream arrives display it in the #remoteVideo element
    this.peerConnection.onaddstream = event => {
      console.log('onaddstream');
      this.remoteVideoElement.srcObject = event.stream;
    };    

    navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user' },
      audio: true
    }).then(stream => {
      this.localVideoElement.srcObject = stream;
      this.peerConnection.addStream(stream);
    });
  }

  onSuccess(){
    console.log('onSuccess!')
    this.peerConnection.setLocalDescription(
      this.message,
      ()=>{console.log('--1--')},
      this.onError
    );
  }
  onError(error){
    console.log('error',error)
  }

  getStyles(){
    let filter = '';
    let transform = '';

    if(this.blur){
      filter += 'blur(5px)';
    }
    if(this.sepia){
      filter += 'sepia(50%)';
    }
    if(this.invert){
      filter += 'invert(1)';
    }
    if(this.flip){
      transform += 'scaleX(-1)';
    }


    return {
      filter,
      transform
    }
  }

}