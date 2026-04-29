import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import api from '../lib/api.js';
import Loading from './Loading.jsx';
import { getErrorMessage } from '../lib/errors.js';

const Verify = () => {

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const params = useParams();

  async function verifyUser() {
    try {
      const { data } = await api.post(`/api/v1/verify/${params.token}`);
      setSuccessMessage(data.message);
    } catch (err) {
      setErrorMessage(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    verifyUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
    {
      loading ? (<Loading />) : (
      <div className="w-[300px] m-auto mt-40">
      { successMessage && (<p className="text-green-500 text-2xl">{successMessage}</p>)}
      { errorMessage && (<p className="text-red-500 text-2xl">{errorMessage}</p>)}
    </div>)
    }
    </>
  )
}

export default Verify
