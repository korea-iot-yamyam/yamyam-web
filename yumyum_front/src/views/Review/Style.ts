import {css} from "@emotion/react";

export const reviewContainer = css`
    padding: 70px 30px 0 30px;
    display: flex;
    justify-content: space-around;
`;
export const reviewLeftContainer = css`
    width: 40%;
    min-width: 600px;
    aspect-ratio: 1;
    border-radius: 20px;
    padding: 30px;
    box-shadow: 0 0 10px 1px #e9e9e9;
    border: 1px solid #e9e9e9;
`;
export const reviewAverageContainer = css`
    padding: 40px 0 0 0 ;
`;
export const reviewAverageTitle = css`
    text-align: center;
    font-size: 30px;
`;
export const reviewAverage = css`
    padding: 15px 0;
    text-align: center;
    font-size: 50px;
`;
export const totalRatingBarContainer = css`
    padding: 10px 0;
    margin: 0 auto;
    display: flex;
    width: 90%;
    justify-content: space-between;
    align-items: center;
`;
export const reviewImgContainer = css`
    width: 25px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 200px;
    & > div {
        height: calc( 200px / 5);
        line-height: calc( 200px / 5);
        display: flex;          /* 자식들을 flex 컨테이너로 */
        align-items: center;    /* 수직 정렬 */
        justify-content: center;/* 수평 정렬 */
    }
    & > div > img {
        height: 25px;
        width: 25px;
    }
`;
export const reviewRatingContainer = css`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 200px;
    padding-left: 5px;
    & > div{
        width: 25px;
        height: calc( 200px / 5);
        line-height: calc( 200px / 5);
        font-size: 16px;
    }
`;
export const reviewRatingBarContainer = css`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 200px;
    padding-left: 10px;
`;
export const ratingBar = css`
    height: calc( 200px / 5);
    display: flex;
    justify-content: center;
    align-items: center;
    
    & > div {
        position: relative;
        border: 1px solid #a0a096;
        border-radius: 2px;
        width: 100%;
        height: 25px;
        margin: 5px 0;
    }
`;

export const ratingBarFill = (percentage: number) => css`
    position: absolute;
    top: -1px;
    left: -1px;
    background-color: #fb8494;
    border: 1px solid black;
    width: ${percentage}%;
    height: 25px;
    border-radius: 2px;
`;

export const reviewCounterContainer = css`
    padding-left: 20px;
    & > div {
        max-width: 45px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
`;

export const reviewCount = css`
    height: calc( 200px / 5);
    line-height: calc( 200px / 5);
`;

export const reviewRightContainer = css`
    width: 40%;
    min-width: 600px;
    aspect-ratio: 1;
    border-radius: 20px;
    padding: 30px;
    box-shadow: 0 0 10px 1px #e9e9e9;
    border: 1px solid #e9e9e9;
`;
export const charStyle = css`
    margin-top: 30px;
    padding: 0 10px;
`