import sequelize from "../models/connect.js";
import { Sequelize } from 'sequelize';
import initModels from "../models/init-models.js";
import { responseData } from "../config/response.js";
import { checkToken, decodeToken } from "../config/jwt.js";

let model = initModels(sequelize);
let Op = Sequelize.Op;

export const getPostData = async (req, res) => {
    try {
        let { token } = req.headers;
        let check = checkToken(token);
        if (check != null && check.name != "TokenExpiredError") {
            // token không hợp lệ
            res.status(401).send(check.name)
            return;
        }
        const PostData = await model.hinh_anh.findAll();
        responseData(res, "Đăng ký thành công", PostData, 200);
    } catch {
        responseData(res, "Lỗi ...", "", 500);
    }
}

export const searchImage = async (req, res) => {
    try {
        let { token } = req.headers;
        let { searchName } = req.body;
        let check = checkToken(token);
        if (check != null && check.name != "TokenExpiredError") {
            // token không hợp lệ
            res.status(401).send(check.name)
            return;
        }
        const PostData = await model.hinh_anh.findAll({
            where: {
                ten_hinh: {
                    [Sequelize.Op.like]: `%${searchName}%`,
                },
            },
        });
        responseData(res, "Đăng ký thành công", PostData, 200);
    } catch {
        responseData(res, "Lỗi ...", "", 500);
    }
}

export const GetImageUserInfor = async (req, res) => {
    try {
        let { token } = req.headers;
        let { imageId } = req.params;
        let check = checkToken(token);
        if (check != null && check.name != "TokenExpiredError") {
            // token không hợp lệ
            res.status(401).send(check.name)
            return;
        }
        const data = await model.hinh_anh.findAll({
            where: {
                hinh_id: imageId
            },
            include: ["nguoi_dung"]
        })
        responseData(res, "Đăng ký thành công", data, 200);
    } catch {
        responseData(res, "Lỗi ...", "", 500);
    }
}

export const GetCommentImage = async (req, res) => {
    try {
        let { token } = req.headers;
        let { imageId } = req.params;
        let check = checkToken(token);
        if (check != null && check.name != "TokenExpiredError") {
            // token không hợp lệ
            res.status(401).send(check.name)
            return;
        }
        const data = await model.binh_luan.findAll({
            where: {
                hinh_id: imageId
            }
        });
        responseData(res, "Đăng ký thành công", data, 200);
    } catch {
        responseData(res, "Lỗi ...", "", 500);
    }
}

export const checkSavedImage = async (req, res) => {
    try {
        let { token } = req.headers;
        let { imageId } = req.params;
        let check = checkToken(token);
        if (check != null && check.name != "TokenExpiredError") {
            // token không hợp lệ
            res.status(401).send(check.name)
            return;
        }
        let accessToken = decodeToken(token);

        const CheckData = await model.luu_anh.findOne({
            where: {
                nguoi_dung_id: accessToken.data.user_id,
                hinh_id: imageId,
            },
        });
        if (CheckData) {
            responseData(res, "Đăng ký thành công", "Đã Saved", 200);
        } else {
            responseData(res, "Đăng ký thành công", "Chưa Saved", 200);
        }
    } catch {
        responseData(res, "Lỗi ...", "", 500);
    }

}


export const SaveCommentToImage = async (req, res) => {
    try {
        let { token } = req.headers;
        let { CommentContent, imageId } = req.body;
        let check = checkToken(token);
        if (check != null && check.name != "TokenExpiredError") {
            // token không hợp lệ
            res.status(401).send(check.name)
            return;
        }
        let accessToken = decodeToken(token);
        let newComment = {
            nguoi_dung_id: accessToken.data.user_id,
            hinh_id: imageId,
            noi_dung: CommentContent,
            ngay_binh_luan: new Date(),
        }
        await model.binh_luan.create(newComment)
        const data = await model.binh_luan.findAll({
            where: {
                hinh_id: imageId
            },
        });

        responseData(res, "Đăng ký thành công", data, 200);

    } catch {
        responseData(res, "Lỗi ...", "", 500);
    }

}


export const DeleteImagebyImageId = async (req, res) => {
    try {
        let { token } = req.headers;
        let { imageId } = req.body;
        let check = checkToken(token);
        if (check != null && check.name != "TokenExpiredError") {
            // token không hợp lệ
            res.status(401).send(check.name)
            return;
        }
        // Delete the image
        const deletedCount = await model.hinh_anh.destroy({
            where: {
                hinh_id: imageId,
            },
        });

        if (deletedCount > 0) {
            // Image deleted successfully
            const data = await model.hinh_anh.findAll();
            responseData(res, "Image deleted successfully", data, 200);
        } else {
            // Image not found
            responseData(res, "Not Found Image", "", 500);
        }


    } catch {
        responseData(res, "Lỗi ...", "", 500);
    }

}