
import sequelize from "../models/connect.js";
import { Sequelize } from 'sequelize';
import initModels from "../models/init-models.js";
import { responseData } from "../config/response.js";
import { checkRefToken, checkToken, createRefToken, createToken, decodeToken } from "../config/jwt.js";
let model = initModels(sequelize);
let Op = Sequelize.Op;

export const getUserData = async (req, res) => {
    try {
        let { token } = req.headers;
        let check = checkToken(token);
        if (check != null && check.name != "TokenExpiredError") {
            // token không hợp lệ
            res.status(401).send(check.name)
            return;
        }
        let accessToken = decodeToken(token);
        const userData = await model.nguoi_dung.findAll({
            where:{
                nguoi_dung_id:accessToken.data.user_id,
            }
        });
        responseData(res, "Đăng ký thành công", userData, 200);
    } catch {
        responseData(res, "Lỗi ...", "", 500);
    }
}


export const signUp = async (req, res) => {
    try {
        let { full_name, email, pass_word, age } = req.body;
        console.log(req.body)
        let checkUser = await model.nguoi_dung.findOne({
            where: {
                email
            }
        })
        // check trùng email
        if (checkUser) {
            responseData(res, "Email đã tồn tại", "", 400);
        }
        let newData = {
            ho_ten: full_name,
            email,
            mat_khau: pass_word,
            tuoi: age,
            anh_dai_dien: ""
        }
        // Create => thêm mới users
        await model.nguoi_dung.create(newData)
        responseData(res, "Đăng ký thành công", "", 200);
    } catch {
        responseData(res, "Lỗi ...", "", 500);
    }
}

export const login = async (req, res) => {

    try {
        let { email, pass_word } = req.body;


        let checkUser = await model.nguoi_dung.findOne({
            where: {
                email: email
            }
        })



        if (checkUser) {

            if (checkUser.mat_khau === pass_word) {
                let key = new Date().getTime();
                let token = createToken({ user_id: checkUser.nguoi_dung_id, key });
                responseData(res, "Login successful", token, 200);
            } else {

                responseData(res, "Password incorrect", "", 400);
            }

        } else {

            responseData(res, "Email không đúng", "", 400);
        }

    } catch {
        responseData(res, "Lỗi ...", "", 500);
    }

}

export const getUserSavedImage = async (req, res) => {
    try {
        let { token } = req.headers;
        let check = checkToken(token);
        if (check != null && check.name != "TokenExpiredError") {
            // token không hợp lệ
            res.status(401).send(check.name)
            return;
        }
        let accessToken = decodeToken(token);
        const data = await model.luu_anh.findAll({
            where:{
                nguoi_dung_id:accessToken.data.user_id,
            }
        });
        responseData(res, "Đăng ký thành công", data, 200);
    } catch {
        responseData(res, "Lỗi ...", "", 500);
    }
}

export const getUserCreatedImage = async (req, res) => {
    try {
        let { token } = req.headers;
        let check = checkToken(token);
        if (check != null && check.name != "TokenExpiredError") {
            // token không hợp lệ
            res.status(401).send(check.name)
            return;
        }
        let accessToken = decodeToken(token);
        const data = await model.hinh_anh.findAll({
            where:{
                nguoi_dung_id:accessToken.data.user_id,
            }
        });
        responseData(res, "Đăng ký thành công", data, 200);
    } catch {
        responseData(res, "Lỗi ...", "", 500);
    }
}
export const userPostImage = async (req, res) => {
    try {
        
        let { token } = req.headers;
        let {file} = req
        let {moTa, tenHinh} = req.body
        let check = checkToken(token);
        if (check != null && check.name != "TokenExpiredError") {
            // token không hợp lệ
            res.status(401).send(check.name)
            return;
        }
       
        let accessToken = decodeToken(token);
        let newData = {
            ten_hinh: tenHinh,
            duong_dan: "localhost:8080/public/imgs/"+file.filename,
            mo_ta: moTa,
            nguoi_dung_id:accessToken.data.user_id
        }
        await model.hinh_anh.create(newData);
        const data = await model.hinh_anh.findAll()
        responseData(res, "Đăng ký thành công", data, 200);
    } catch {
        responseData(res, "Lỗi ...", "", 500);
    }
}


export const ChangeUserDetail = async (req, res) => {
    // try {
        
        let { token } = req.headers;
        let {file} = req;
        let {hoTen,Tuoi,MatKhau} = req.body
        
        let check = checkToken(token);
        if (check != null && check.name != "TokenExpiredError") {
            // token không hợp lệ
            res.status(401).send(check.name)
            return;
        }
        let accessToken = decodeToken(token);
        
        let UserData = await model.nguoi_dung.findOne({
            where:{
                nguoi_dung_id:accessToken.data.user_id
            }
        })
        if (!UserData) {
            // User not found
            responseData(res, "User Not Found", "", 404);
            return;
        }

        if (hoTen) {
            
            UserData.ho_ten = hoTen;

        }
        if (Tuoi) {
            UserData.tuoi = Tuoi;

        }
        if (MatKhau) {
            UserData.mat_khau = MatKhau;

        }
        if(file){
            UserData.anh_dai_dien = file.filename;

        }

        await model.nguoi_dung.update(UserData.dataValues, {
            where: {
                nguoi_dung_id: accessToken.data.user_id
            }
        });
        
        responseData(res, "Đăng ký thành công", "", 200);
    // } catch {
    //     responseData(res, "Lỗi ...", "", 500);
    // }
}