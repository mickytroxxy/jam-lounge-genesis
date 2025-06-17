import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface SecretsType {
  OPENAI_API: string;
  appleApproved:boolean;
  playFee:number;
  bidShare:number;
  appId:string;
  WHATSAPP: string;
  SMS_AUTH: string;
  SMS_KEY: string;
  canSendSms: boolean;
  googleApiKey:string;
  googleApiKeyActive:boolean;
  deliveryFee:number;
  vatFee:number,
  genres:string[],
  premiumPlaysLastClaimedDate:number;
  premiumFee:number;
  baseUrl:string;
}

const initialState: {secrets:SecretsType} = {
  secrets:{
    OPENAI_API:'sk-w0P9FsPYsEqDDKSVHWX6ahkmgv8BvzPhP_IBVR8SPJT3BlbkFJw2cGST5ZluAPBb_YOaS_6-uoQdzPga8CuBpI6qZuAA',
    appleApproved:false,
    WHATSAPP:'27736120177',
    SMS_AUTH:'aW5mb0BlbXBpcmVkaWdpdGFscy5vcmc6ZW1waXJlRGlnaXRhbHMxIUA=',
    SMS_KEY:"aW5mb0BlbXBpcmVkaWdpdGFscy5vcmc6ZW1waXJlRGlnaXRhbHMxIUA=",
    googleApiKey:'',
    googleApiKeyActive:true,
    deliveryFee:200,
    vatFee:0,
    canSendSms:false,
    premiumPlaysLastClaimedDate:0,
    premiumFee:75,
    playFee:0.5,
    bidShare:0.5,
    baseUrl:'https://play-server-913115376008.europe-west1.run.app',
    appId:'LA10613716',
    genres:[
      'Amapiano',
      'House',
      'Deep House',
      'Techno',
      'Hip Hop',
      'R&B',
      'Pop',
      'Rock',
      'Jazz',
      'Reggae',
      'Afrobeat',
      'Dancehall',
      'Electro',
      'Country',
      'Trance',
      'Drum & Bass',
      'EDM',
      'Soul',
      'Tropical',
      'Gospel',
      'Classical',
      'Alternative',
      'Sungura',
      'Grime'
    ]
  }
};

const globalVariables = createSlice({
  name: "globalVariables",
  initialState,
  reducers: {
    setSecrets: (state, action: PayloadAction<SecretsType>) => {
      state.secrets = action.payload;
    }
  },
});

export const { setSecrets } = globalVariables.actions;
export default globalVariables.reducer;
