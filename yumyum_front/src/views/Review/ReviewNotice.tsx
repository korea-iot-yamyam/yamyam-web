/** @jsxImportSource @emotion/react */
import React, {useEffect, useRef, useState} from 'react';
import * as css from "./Style";
import ReactQuill from "react-quill-new";
import moment from "moment/moment";
import axios from "axios";
import {useCookies} from "react-cookie";
import 'react-quill/dist/quill.snow.css';
import QuillResizeImage from "quill-resize-image";
import Quill from "quill";
import useScrollTop from "../../hooks/scroll/useScrollToTop";

Quill.register('modules/resize', QuillResizeImage);

const ReviewNotice = () => {
    const [cookies] = useCookies(['token']);
    const token = cookies.token;
    const [imgUrl, setImgUrl] = useState("");
    const [button, setButton] = useState("save");
    const [noticeId, setNoticeId] = useState(0);
    const [editorContent, setEditorContent] = useState(""); // 에디터 데이터
    const quillRef = useRef<ReactQuill | null>(null);

    const scrollToTop = useScrollTop();

    useEffect(() => {
        scrollToTop();
    }, []);
    const noticeCreateFetch = async () => {
        console.log("저장 버튼 클릭됨");
        if (!quillRef.current) {
            console.error("Quill reference is null");
            return;
        }
        const editor = quillRef.current.getEditor();
        const editorContentHTML = editor.root.innerHTML;
        const base64ImageRegex = /<img[^>]+src="data:image\/[^">]+"[^>]*>/g;
        const srcExtractRegex = /src="([^"]+)"/;

        let newHTML = editorContentHTML;

        const formData = new FormData();
        const matches = editorContentHTML.match(base64ImageRegex) || [];
        matches.forEach((imgTag, index) => {
            const srcMatch = imgTag.match(srcExtractRegex);
            if (!srcMatch) return;
            const base64URL = srcMatch[1];
            const file = dataURLtoFile(base64URL, `image_${index}.png`);
            const newImgTag = imgTag.replace(base64URL, `image_${index}.png`);
            newHTML = newHTML.replace(imgTag, newImgTag);
            formData.append('noticePhotoUrl', file);
        });

        const noticeDate = moment().format('YYYY-MM-DDTHH:mm:ss');
        formData.append('noticeDate', noticeDate);
        formData.append('noticeText', newHTML);

        try {
            console.log('업로드할 FormData:', formData);

            const response = await axios.post('http://localhost:4041/api/v1/reviews/notice/create', formData, {
                headers: {
                    Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data',
                },
            });

            alert('공지사항 등록 완료');
            console.log('서버 응답:', response.data);
            setImgUrl(response.data.data.noticePhotoUrl);
            setEditorContent(response.data.data.noticeText || "");
            setButton("change");

        } catch (error) {
            console.error(error);
            alert('업로드 중 문제가 발생했습니다.');
        }
    };

    const dataURLtoFile = (dataurl: string, filename: string) => {
        const arr = dataurl.split(",");
        const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type: mime});
    };

    const noticeGetFetch = async () => {
        try {
            const response = await axios.get(`http://localhost:4041/api/v1/reviews/notice`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                });

            if (response.data.data) {
                setImgUrl(response.data.data.noticePhotoUrl);
                setEditorContent(response.data.data.noticeText || "");
                setButton("change");
                setNoticeId(response.data.data.id)
            }
            console.log(editorContent)
        } catch (error) {
            console.error("이미지 URL을 가져오는 중 오류 발생:", error);
        }
    };

    const noticeDeleteFetch = async () => {
        try {
            const response = await axios.delete(`http://localhost:4041/api/v1/reviews/notice/delete/${noticeId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                });

            if (response.data.data) {
                setImgUrl("");
                setEditorContent(""); // 에디터 데이터 설정
                setButton("save");
                setNoticeId(0)
            }
            console.log(editorContent)
        } catch (error) {
            console.error("이미지 URL을 가져오는 중 오류 발생:", error);
        }
    };

    // const noticeUpdate = async () => {
    //     console.log("수정완료 버튼 클릭됨");
    //     if (!quillRef.current) {
    //         console.error("Quill reference is null");
    //         return;
    //     }
    //     const editor = quillRef.current.getEditor();
    //     const editorContentHTML = editor.root.innerHTML;
    //
    //     const base64ImageRegex = /<images[^>]+src="data:image\/[^">]+"[^>]*>/g;
    //     const srcExtractRegex = /src="([^"]+)"/;
    //
    //     let newHTML = editorContentHTML;
    //
    //     const formData = new FormData();
    //     const matches = editorContentHTML.match(base64ImageRegex) || [];
    //     matches.forEach((imgTag, index) => {
    //         const srcMatch = imgTag.match(srcExtractRegex);
    //         if (!srcMatch) return;
    //         const base64URL = srcMatch[1];
    //         const file = dataURLtoFile(base64URL, `image_${index}.png`);
    //         const newImgTag = imgTag.replace(base64URL, `image_${index}.png`);
    //         newHTML = newHTML.replace(imgTag, newImgTag);
    //         formData.append('noticePhotoUrl', file);
    //     });
    //
    //     const noticeDate = moment().format('YYYY-MM-DDTHH:mm:ss');
    //     formData.append('noticeDate', noticeDate);
    //     formData.append('noticeText', newHTML);
    //
    //     try {
    //         console.log('업로드할 FormData:', formData);
    //
    //         const response = await axios.post('http://localhost:4041/api/v1/reviews/notice/update,', formData,
    //             {
    //                 headers: {
    //                     Authorization: `Bearer ${token}`,
    //                     'Content-Type': 'multipart/form-data',
    //             },
    //         });
    //
    //         alert('공지사항 등록 완료');
    //         console.log('서버 응답:', response.data);
    //         setImgUrl(response.data.data.noticePhotoUrl);
    //         setEditorContent(response.data.data.noticeText || ""); // 에디터 데이터 설정
    //         setButton("change");
    //
    //     } catch (error) {
    //         console.error(error);
    //         alert('업로드 중 문제가 발생했습니다.');
    //     }
    // }

    useEffect(() => {
        if (quillRef.current && button === "changeUpdate" && editorContent) {
            const editor = quillRef.current.getEditor();
            const processedHtml = editorContent.replace(/<img[^>]+src="([^"]+)"[^>]*>/g, (match, src) => {
                if (!src.startsWith('http')) {
                    return match.replace(src, `http://localhost:4041/image/upload/${imgUrl}`); //http://localhost:4041/image/upload/notice/aa91636b-3ff6-4d60-b31d-2bdaf81ca591_image_0.png
                }
                return match;
            });
            editor.clipboard.dangerouslyPasteHTML(processedHtml);
        }
    }, [button, editorContent]);

    useEffect(() => {
        noticeGetFetch();
    }, []);

    const renderChangeView = () => (
        <>
            <div
                style={{
                    width: "100%",
                }}
            >
                <div
                    dangerouslySetInnerHTML={{
                        __html: editorContent
                            .replace(
                                /<img[^>]+src="([^"]+)"[^>]*>/g, (match : string, src : any) => {
                                    if (!src.startsWith("http")) {
                                        return match.replace(src, `http://localhost:4041/image/upload/${imgUrl}`)
                                    }
                                    return match;
                                }
                            )
                            .replace(
                                /class="ql-align-(center|right|left)"/g,
                                (match, align) => {
                                    if (align === "center") {
                                        return 'style="text-align: center;"';
                                    }
                                    if (align === "right") {
                                        return 'style="text-align: right;"';
                                    }
                                    if (align === "left") {
                                        return 'style="text-align: left;"';
                                    }
                                    return match;
                                }
                            ),
                    }}
                />
            </div>
            <div css={css.reviewNoticeDeleteButtonContainer}>
                <button
                    css={css.reviewNoticeUploadButton}
                    onClick={() => noticeDeleteFetch()}
                >
                    삭제
                </button>
            </div>
        </>
    );

    const renderSaveView = () => (
        <>
            <ReactQuill
                ref={quillRef}
                css={css.quill}
                modules={{
                    toolbar: [
                        ["image", "link"],
                        [{header: [1, 2, 3, false]}],
                        ["bold", "italic", "underline", "strike"],
                        [{list: "ordered"}, {list: "bullet"}],
                        [{align: []}, {color: []}, {background: []}],
                        ["clean"],
                    ],
                    resize: {},
                }}
                theme="snow"
                placeholder="리뷰 공지사항을 작성해주세요"
            />
            <div css={css.reviewNoticeUploadButtonContainer}>
                <button
                    css={css.reviewNoticeUploadButton}
                    onClick={() => noticeCreateFetch()}
                >
                    저장
                </button>
            </div>
        </>
    );

    // const renderChangeUpdateView = () => (
    //     <>
    //         <ReactQuill
    //             ref={quillRef}
    //             css={css.quill}
    //             modules={{
    //                 toolbar: [
    //                     ["image", "link"],
    //                     [{header: [1, 2, 3, false]}],
    //                     ["bold", "italic", "underline", "strike"],
    //                     [{list: "ordered"}, {list: "bullet"}],
    //                     [{align: []}, {color: []}, {background: []}],
    //                     ["clean"],
    //                 ],
    //                 resize: {},
    //             }}
    //             theme="snow"
    //             placeholder="리뷰 공지사항을 작성해주세요"
    //         />
    //         <button
    //             css={css.reviewNoticeUploadButton}
    //             onClick={() => noticeUpdate}
    //         >
    //             수정 완료
    //         </button>
    //     </>
    // );

    return (
        <>
            <div css={css.quillContainer}>
                {button === "change" && renderChangeView()}
                {button === "save" && renderSaveView()}
                {/*{button === "changeUpdate" && renderChangeUpdateView()}*/}
            </div>
        </>
    )
};

export default ReviewNotice;