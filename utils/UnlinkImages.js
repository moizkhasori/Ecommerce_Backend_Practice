import fs from "fs"

export const unlinkImages = (filearray) => {
    filearray.forEach(file => {
        fs.unlinkSync(file.path)
    });
}