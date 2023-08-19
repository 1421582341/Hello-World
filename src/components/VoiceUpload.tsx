import React from 'react';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Upload, message } from 'antd';
import { RcFile } from 'antd/lib/upload/interface'
import '../styles/VoiceUpload.less';

interface VoiceUploadProps {
  onUpload: (file: RcFile) => void
}

const VoiceUpload: React.FC<VoiceUploadProps> = ({ onUpload }) => {

  const { Dragger } = Upload;

  const draggerProps: UploadProps = {
    name: 'file',
    multiple: false,
    // 接口地址
    // action: '',
    onChange: info => {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop: e => {
      console.log('Dropped files', e.dataTransfer.files)
    },
    beforeUpload: file => {
      console.log(file)
      onUpload(file);
      return false;
    },
    maxCount: 1,
  }

  return (
    <Dragger {...draggerProps} className='dragger'>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">拖拽上传或点击选择文件</p>
    </Dragger>
  );
}

export default VoiceUpload;