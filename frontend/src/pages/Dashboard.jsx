import React, { useEffect, useState } from 'react'
import api from '../../apiInterceptor';
import { showError } from '../lib/errors.js';

const Dashboard = () => {

  const [content, setContent] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get(`/api/v1/admin`);
        if (!cancelled) setContent(data.message);
      } catch (err) {
        if (!cancelled) showError(err);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      {content && <div>{content}</div>}
    </>
  );
}

export default Dashboard;

