import axios from 'axios'

const getUserData = async (access_token: string) => {
  try {
    const { data } = await axios({
      url: 'https://www.googleapis.com/oauth2/v2/userinfo',
      method: 'get',
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })

    return data
  } catch (err) {
    throw new Error(err)
  }
}

export default {
  getUserData,
}