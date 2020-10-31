import axios from 'axios'
import { GoogleService, GoogleUserData } from '../../../types'

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

export const GoogleSerivce: GoogleService = {
  getUserData: getUserData,
}

export default {
  getUserData,
}