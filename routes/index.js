var express = require('express');
var router = express.Router();
var data=require('../database/dbConnect');
var sessionId;  //存储session值
var sessionName;


//登陆页
router.route('/')
    .get(function(req, res) {
  		res.render('login', { 
            docTitle: '学生选课管理系统' ,
            bodyTitle:'商大学生选课管理系统'
        });
	})
    .post(function(req, res) {
        var id = req.body.id_input;
        var pwd = req.body.pwd_input;
        client=data.connectServer();    //建立连接
        result=null;    //清空结果集
        if(req.body.stu_login){
            data.dbControl(client, "select * from student_info where stu_id='"+id+"'", function (result) {
            if(!result[0]){
                res.send("<script>alert('不存在这个ID！你是来逗逼的吧！');</script>");
            }else{
                if(result[0].stu_pwd===pwd){
                    req.session.stu_id=id;   //保存id到session中
                    sessionId = req.session.stu_id; //保存session在全局变量中，方便后面调用
                    req.session.stu_name=result[0].stu_name;
                    sessionName = req.session.stu_name;
                    res.redirect('/stu_index');
                }else
                {
                    res.redirect('/');
                }
               }
            });
        };
        if(req.body.teacher_login){
            data.dbControl(client, "select * from teacher_info where teacher_id='"+id+"'", function (result) {
            if(!result[0]){
                res.send("<script>alert('不存在这个ID！你是来逗逼的吧！');</script>");
            }else{
                if(result[0].teacher_pwd===pwd){
                    req.session.teacher_id=id;
                    sessionId = req.session.teacher_id;
                    req.session.teacher_name=result[0].teacher_name;
                    sessionName = req.session.teacher_name;
                    res.redirect('/teacher_index');
                }else{
                    res.redirect('/');
                }
               }
            });
        };
        if(req.body.reg){
            res.redirect('/reg');
        }
    });

//学生个人主页
router.get('/stu_index', function(req, res) {
        if(sessionId&&sessionName){
            res.render('stu_index', { 
                docTitle: sessionName+'同学的管理空间' ,
                stuSelectedLession: '查看已选课程' ,
                stuAllLession: '查看所有课程' ,
                stuForTeacher: '查看教师信息' ,
                stuInfo: '查看个人信息'
            });
        }
    });

    //学生已选课程
    router.route('/manage/stuSelectedLession')
        .get(function(req, res) {
            if(sessionId&&sessionName){
                client=data.connectServer();
                result=null;
                data.dbControl(client, "select * from subject_info,student_subject where subject_info.subject_id=student_subject.subject_id and stu_id='"+sessionId+"'", function (result) {
                    var item = result;
                    res.render('manage/stuSelectedLession', {
                        item : item ,
                        docTitle: sessionName+'同学的管理空间' ,
                        bodyTitle: '必修课' ,
                        subId: '学科代号：' ,
                        subTeacher: '学科老师：' ,
                        subDesc: '学科描述：'
                    })
                })
            };
        })
        .post(function(req, res) {
            var deleteSub = req.body.sub;
            var deleteStu = sessionId;
            client=data.connectServer();
            data.dbControl(client, "delete from student_subject where subject_id='"+deleteSub+"' and stu_id='"+deleteStu+"'", function (err) {
                console.log('删除了');
            })
            res.end();
        });

        //学生所有课程
        router.route('/manage/stuAllLession')
            .get(function(req, res){
                if(sessionId&&sessionName){
                client=data.connectServer();
                result=null;
                data.dbControl(client, "select * from subject_info", function (result) {
                    var item = result;
                    res.render('manage/stuAllLession', {
                        item : item ,
                        docTitle: sessionName+'同学的管理空间' ,
                        bodyTitle: '必修课' ,
                        subId: '学科代号：' ,
                        subTeacher: '学科老师：' ,
                        subDesc: '学科描述：'
                    })
                })
            };
            })
            .post(function(req, res){
                var addSub = req.body.sub;
                var addStu = sessionId;
                client=data.connectServer();
                result=null;
                data.dbControl(client, "select * from student_subject where stu_id='"+addStu+"' and subject_id='"+addSub+"'", function (result) {
                    if(result[0]){
                        res.send('选过了！');
                    }
                    else{
                        client=data.connectServer();
                        result=null;
                        data.dbControl(client, "insert into student_subject (stu_id, subject_id) values ('"+addStu+"', '"+addSub+"')", function (err) {
                            console.log('插入了！');
                        })
                    }
                    res.end();
                });
            });

        //查看任课老师
        router.get('/manage/stuForTeacher',function(req, res){
                if(sessionId&&sessionName){
                    client=data.connectServer();
                    result=null;
                    data.dbControl(client, "select * from teacher_info,subject_info,teacher_subject where teacher_info.teacher_id=teacher_subject.teacher_id and subject_info.subject_id=teacher_subject.subject_id", function(result){
                        var item = result;
                        res.render('manage/stuForTeacher', {
                            docTitle: sessionName+'同学的管理空间' ,
                            id: '工号：' ,
                            age: '年龄：' ,
                            sex: '性别：' ,
                            tel: '电话：' ,
                            lession: '任课：' ,
                            item : item
                        })
                    })
                }
            });

        //学生个人信息
        router.route('/manage/stuInfo')
            .get(function(req, res){
                if(sessionId&&sessionName){
                    client=data.connectServer();
                    result=null;
                    data.dbControl(client, "select * from student_info where stu_id='"+sessionId+"'", function(result){
                        var item = result;
                        res.render('manage/stuInfo', {
                            docTitle: stu_name+'同学的管理空间' ,
                            item:item
                        })
                    })
                }
            })
            .post(function(req, res){
                var new_name      = req.body.stu_name,
                    new_age       = req.body.stu_age,
                    new_sex       = req.body.stu_sex,
                    new_subject   = req.body.stu_subject,
                    new_telephone = req.body.stu_telephone,
                    new_describe  = req.body.stu_describe;
                client=data.connectServer();
                result=null;
                data.updataStu(client, "update student_info set stu_name='"+new_name+"', stu_age='"+new_age+"', stu_sex='"+new_sex+"', stu_subject='"+new_subject+"', stu_telephone='"+new_telephone+"', stu_describe='"+new_describe+"' where stu_id='"+sessionId+"'", function(result){
                    res.redirect('/manage/stuInfo');
                })
            });


//教师个人主页
router.get('/teacher_index', function(req, res) {
        if(sessionId&&sessionName){
            res.render('teacher_index', { 
                docTitle: sessionName+'老师的管理空间' ,
                teacherAllLession: '查看所有课程' ,
                teacherSelectedLession: '查看已带课程' ,
                teacherInfo: '查看个人信息'
            });
        }
    });

    //查看所有课程
    router.route('/manage/teacherAllLession')
        .get(function(req, res){
            if(sessionId&&sessionName){
                client=data.connectServer();
                result=null;
                data.dbControl(client, "select * from subject_info", function(result){
                    var item = result;
                    res.render('manage/teacherAllLession', {
                        docTitle: sessionName+'老师的管理空间' ,
                        bodyTitle: '必修课' ,
                        subId: '学科代号：' ,
                        subTeacher: '学科老师：' ,
                        subDesc: '学科描述：' ,
                        item : item
                    })
                })
            }
        })
        .post(function(req, res){
            var subId=req.body.sub;
            var teacherId=sessionId;
            client=data.connectServer();
            result=null;
            data.dbControl(client, "select * from teacher_subject where teacher_id='"+teacherId+"' and subject_id='"+subId+"'", function (result) {
                if(result[0]){
                    res.send('已经任课了！');
                }
                else{
                    client=data.connectServer();
                    result=null;
                    data.dbControl(client, "insert into teacher_subject (teacher_id, subject_id) values ('"+teacherId+"', '"+subId+"')", function (err) {
                        console.log('插入了！');
                    })
                }
                res.end();
            });
        });

        //老师已带课程
        router.route('/manage/teacherSelectedLession')
            .get(function(req, res){
                if(sessionId&&sessionName){
                    client=data.connectServer();
                    result=null;
                    data.dbControl(client, "select * from subject_info,teacher_subject where subject_info.subject_id=teacher_subject.subject_id and teacher_id='"+sessionId+"'", function(result){
                        var item = result;
                        res.render('manage/teacherSelectedLession', {
                            docTitle: sessionName+'老师的管理空间' ,
                            bodyTitle: '必修课' ,
                            subId: '学科代号：' ,
                            subTeacher: '学科老师：' ,
                            subDesc: '学科描述：' ,
                            item : item
                        })
                    })
                }
            })
            .post(function(req, res){
                var deleteSub = req.body.sub;
                var deleteTeacher = sessionId;
                client=data.connectServer();
                result=null;
                data.dbControl(client, "delete from teacher_subject where subject_id='"+deleteSub+"' and teacher_id='"+deleteTeacher+"'", function (err) {
                    console.log('删除了');
                })
                res.end();
            });


//注册页
router.route('/reg')
    .get(function(req, res){
        var item = result;
        res.render('reg', {
            docTitle: '注册吧骚年' 
        })
    })
    .post(function(req, res){
        var new_id        = req.body.stu_id,
            new_pwd       = req.body.stu_pwd,
            new_name      = req.body.stu_name,
            new_age       = req.body.stu_age,
            new_sex       = req.body.stu_sex,
            new_grade     = req.body.stu_grade,
            new_subject   = req.body.stu_subject,
            new_telephone = req.body.stu_telephone,
            new_describe  = req.body.stu_describe;
        client=data.connectServer();
        result=null;
        data.dbControl(client, "insert into student_info (stu_id, stu_pwd, stu_name, stu_age, stu_sex, stu_grade, stu_subject, stu_telephone, stu_describe) values ('"+new_id+"', '"+new_pwd+"', '"+new_name+"', '"+new_age+"', '"+new_sex+"', '"+new_grade+"', '"+new_subject+"', '"+new_telephone+"', '"+new_describe+"')", function(result){
            sessionId = new_id;
            sessionName = new_name;
            res.redirect('/stu_index');
        })
    });


module.exports = router;