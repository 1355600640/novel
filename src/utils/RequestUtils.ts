import axios from '../common/requestConfig'
import { AxiosResponse } from 'axios'

type data<T> = {
  status: number
  message: string
  data: T|any
}
export type response<T> = Promise<AxiosResponse<data<T>>>

export function get(url: string, params?: any): any {
  return axios({
    method: 'get',
    url,
    params,
    timeout: 15000,
  })
    .then((response) => {
      return response
    })
    .then((res) => {
      return res
    })
}

export function post(url: string, data?: any): any {
  return axios({
    method: 'post',
    url,
    data,
    timeout: 15000,
    headers: {
      // 'X-Requested-With': 'XMLHttpRequest',
      // 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      'Content-Type': 'application/json;charset=UTF-8',
    },
  })
    .then((response) => {
      return response
    })
    .then((res) => {
      return res
    })
}
