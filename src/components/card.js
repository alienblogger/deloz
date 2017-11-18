import React from "react";

//Return Cards based on card Data

export default function Card(props) {
  const { data } = props;
  return (
    <div className="card" onClick={()=>{goToRepo(data.html_url)}}>
      <div className="card-header">
        <h3 className="repo-title">{data.full_name}</h3>
        <div className="repo-avatar">
          <img src={data.owner.avatar_url} alt="" />
        </div>
      </div>
      <div className="card-body">
        <div className="repo-desc">{data.description || "No Description"}</div>
      </div>
      <div className="card-footer">
        <div className="flex">
          <div className="icon-font flex flex-1 flex-align-center">
            <div>
              <i className="fa fa-star" /> {data.stargazers_count}
            </div>
          </div>
          <div className="flex flex-1 flex-align-center">
            {data.language?<div className="badge">{data.language}</div>:<div>Not Specified</div>}
          </div>
          <div className=" icon-font flex flex-1 flex-align-center">
            <i className="fa fa-code-fork" /> {data.forks_count}
          </div>
        </div>
      </div>
    </div>
  );
}


function goToRepo(url){
  window.open(url,"_blank");
}
