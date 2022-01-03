import React, { Fragment } from 'react'

const AddAddressCard = props => {
    return (
      // <div
      // className={`card`}>
      //   <div className="blog-box blog-list row" style={{height:100}} onClick={props.onClick}>
      //   <div className="col-sm-12">
      //     <div className="blog-details p-15" style={{display: 'flex' , justifyContent: 'center'}}>
      //       <h6 className="m-b-5" style={{fontSize:16}}>
      //       <i className="fa fa-plus" style={{fontSize:16}}></i> {props.title}
      //       </h6>
      //       {/* <div className="blog-date digits"></div> */}
      //     </div>
      //   </div>
      // </div>
      // </div>
      // <Fragment>
        <div className="col-md-12"
        style={{height:"80%"}}
        >
        <div
          className={`card  m-b-10 h-100`}
          style={{borderRadius:0}}
          onClick={props.onAddClick}
        >
          <div className="blog-box blog-list row h-100" style={{border: `1px solid  #A9A9A9`}}>
            
            <div className="col-3 pad-custom d-flex align-items-center"
            style={{justifyContent:"flex-end"}}
            >
              <i className="fa fa-plus" style={{fontSize:16}}></i>
            </div>
            <div className="col-8 blog-details">
              {/* <div className=""> */}
                <h6 className="m-0  d-flex align-items-center justify-content-center">{props.title} </h6>

          {/* <div className="blog-date digits">{props.title}</div> */}
              {/* </div> */}
            </div>
          </div>
        </div>
      </div>
      // </Fragment>
    )
}

export default AddAddressCard
