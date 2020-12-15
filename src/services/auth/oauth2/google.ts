import axios from 'axios'
import { GoogleService, GoogleUserAuthSession, GoogleUserData } from '../../../types'


const GoogleOAuth2ClientCredentials = {
  id: process.env.GOOGLE_CLIENT_ID,
  secret: process.env.GOOGLE_CLIENT_SECRET,
  redirect_uri: 'http://localhost:7777/login',
  scopes: [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
  ],
}


const getUserData = async (access_token: string) => {
  try {
    const { data } = await axios({
      url: 'https://www.googleapis.com/oauth2/v2/userinfo',
      method: 'get',
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })

    return data as GoogleUserData
  } catch (err) {
    throw new Error(err)
  }
}

const exchangeAccessTokenForCode = async (code: string) => {
  try {
    const { data } = await axios({
      url: 'https://oauth2.googleapis.com/token',
      data: {
        client_id: GoogleOAuth2ClientCredentials.id,
        client_secret: GoogleOAuth2ClientCredentials.secret,
        redirect_uri: GoogleOAuth2ClientCredentials.redirect_uri,
        grant_type: 'authorization_code',
        code,
      },
      method: 'post',
    })

    return data as GoogleUserAuthSession
  } catch (err) {
    throw new Error(err)
  }
}

export const GoogleSerivce: GoogleService = {
  getUserData,
  exchangeAccessTokenForCode,
}