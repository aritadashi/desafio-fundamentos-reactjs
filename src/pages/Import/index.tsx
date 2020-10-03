import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import filesize from 'filesize';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const history = useHistory();

  async function handleUpload(): Promise<void> {
    uploadedFiles.forEach(async function (fileProp) {
      const data = new FormData();

      data.append('file', fileProp.file);

      // console.log(data);
      try {
        await api.post('/transactions/import', data);
        // console.log(resp);
      } catch (err) {
        console.log(err.response.error);
      }
    });
    history.push('/');
  }

  function submitFile(files: File[]): void {
    // console.log(files);
    files.map(file => {
      setUploadedFiles([
        ...uploadedFiles,
        {
          file,
          name: file.name,
          readableSize: filesize(file.size),
        },
      ]);
    });
    // console.log(uploadedFiles);
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
