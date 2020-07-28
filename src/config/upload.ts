import path from 'path';
import crypto from 'crypto';
import multer from 'multer';

const tmpFolder =  path.resolve(__dirname, '..', '..', 'tmp');

export default{
    directory: tmpFolder,

    storage: multer.diskStorage({ //armazenamento no disco da máquina
            destination: tmpFolder, // pasta que será salvo os arquivos
            filename(request, file, callback){// modifica o nome do arquivo
            const fileHash = crypto.randomBytes(10).toString('hex'); // cria um hash aleatorio
            const fileName = `${fileHash}-${file.originalname}`; // junta com o nome original do arquivo

            return callback(null, fileName);
        },
    }),
};
