import { useState } from 'react';
import { Select, Button, message, Slider } from 'antd';
import { RcFile } from 'antd/lib/upload/interface';
import ReactAudioPlayer from 'react-audio-player';
import VoiceUpload from './components/VoiceUpload';
import axios from 'axios';
import './App.less'

const App: React.FC = () => {
  const [type, setType] = useState(1);
  const [key, setKey] = useState(0);
  const [file, setFile] = useState<RcFile>();
  const [audioSrc, setAudioSrc] = useState<string>();
  const [loading, setLoading] = useState(false);

  const options = [
    { value: 1, label: '牧濑红莉栖' },
  ];

  const handleSelect = (val: number) => {
    setType(val);
  };

  const handleUpload = (file: RcFile) => {
    setFile(file);
  };

  const handleChange = (val: number) => {
    setKey(val);
  };

  const handleSubmit = () => {
    const data = new FormData()
    data.append('type', String(type));
    data.append('file', file as RcFile);
    data.append('key', String(key));
    axios.post('http://127.0.0.1:5000/upload', data).then(res => {
      if (res.status === 200) {
        message.success('上传成功');
        setLoading(true);
        const polling = setInterval(() => {
          axios.get(`http://127.0.0.1:5000/download?token=${res.data.token}`).then(res => {
            if (res.data.code == 1000) {
              setAudioSrc(res.data.data.file);
              clearInterval(polling);
              setLoading(false);
            } else if (res.data.code == 1002) {
              message.error('处理失败');
              setLoading(false);
            }
          });
        }, 1000);
      }
    }).catch(() => {
      message.error('上传失败');
    });
  };

  return (
    <>
      <div className='container'>
        <div className='title'>Hello World!</div>
        <VoiceUpload onUpload={handleUpload} />
        <div className='label'>请选择声线</div>
        <Select
          defaultValue={1}
          options={options}
          className='selector'
          onChange={handleSelect}
        />
        <div className='label'>请选择音调</div>
        <div className='slider'>
          <Slider defaultValue={0} onAfterChange={handleChange} max={5} min={-5} />
        </div>
        <Button type='primary' onClick={handleSubmit} className='button' loading={loading}>{ loading ? '处理中' : '上传' }</Button>
        {audioSrc &&
          <ReactAudioPlayer
            src={'http://jssz-inner-boss.bilibili.co/mundo_log/chunbuwan.wav?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=fUoYnMWXGBeCwC4G%2F20230818%2F%2Fs3%2Faws4_request&X-Amz-Date=20230818T102413Z&X-Amz-Expires=300&X-Amz-SignedHeaders=host&x-id=GetObject&X-Amz-Signature=c76088eb648458d22310455f8f970c1b8942a7587573b6b8d1f5fc17765352b5'}
            controls
          />
        }
      </div>
    </>
  )
}

export default App
