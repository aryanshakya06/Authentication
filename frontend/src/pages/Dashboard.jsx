import React, { useEffect, useState } from 'react'
import api from '../../apiInterceptor';
import { showError } from '../lib/errors.js';

const Dashboard = () => {

  const [content, setContent] = useState("")

  async function fetchAdminData() {
       try {
          const { data } = await api.get(`/api/v1/admin`);
          setContent(data.message);
       } catch (err) {
          showError(err);
       }
  }
  useEffect(() => {
    fetchAdminData();
  }, [])

  return (
    <>
    {
      content && <div>{content}</div>
    }
    </>
  )
}

export default Dashboard
