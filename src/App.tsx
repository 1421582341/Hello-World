import { useState } from 'react';
import { Select, Button, message, Slider, Tabs } from 'antd';
import { ShareAltOutlined } from '@ant-design/icons';
import { RcFile } from 'antd/lib/upload/interface';
import ReactAudioPlayer from 'react-audio-player';
import VoiceUpload from './components/VoiceUpload';
import axios from 'axios';
import copy from 'copy-to-clipboard';
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

  const tabItems = [
    {
      key: '1',
      label: '首页',
    },
    {
      key: '2',
      label: '社群',
    }
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
  
  const handleCopy = () => {
    copy(audioSrc!);
    message.success('链接复制成功');
  }

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
        <Tabs defaultActiveKey='1' items={tabItems} />
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
          <>
            <ReactAudioPlayer
              src={audioSrc}
              controls
            />
            <Button icon={<ShareAltOutlined />} type='primary' className='share-icon' onClick={handleCopy} />
          </>
        }
      </div>
    </>
  )
}

export default App
