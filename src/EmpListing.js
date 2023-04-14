import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EmpListing = () => {
    const [empdata, empdatachange] = useState(null);
    const [custlist, custupdate] = useState([]);
    const [haveedit, editchange] = useState(false);
    const [haveview, viewchange] = useState(false);
    const [haveadd, addchange] = useState(false);
    const [haveremove, removechange] = useState(false);
    const navigate = useNavigate();

    const LoadDetail = (id) => {
        navigate("/employee/detail/" + id);
    }
    const LoadAdd = () => {
        if (haveadd){
            navigate("/employee/create/");}
        else{
            toast.warning('You are not having access for Add');
        }
    }
    const LoadEdit = (id) => {
        if (haveedit){
            navigate("/employee/edit/" + id);}
        else{
            toast.warning('You are not having access for Edit');
        }
    }
    const Removefunction = (id) => {
        if (haveremove){
            if (window.confirm('Do you want to remove?')) {
                fetch("http://localhost:8000/employee/" + id, {
                    method: "DELETE"
                }).then((res) => {
                    alert('Removed successfully.')
                    window.location.reload();
                }).catch((err) => {
                    console.log(err.message)
                })
            }
        }
        else{
            toast.warning('You are not having access for Remove');
        }
    }

    useEffect(() => {
        LoadEmployee();
        GetUserAccess();
    }, [])

    const LoadEmployee = () => {
        fetch("http://localhost:8000/employee").then((res) => {
            return res.json();
        }).then((resp) => {
            empdatachange(resp);
        }).catch((err) => {
            console.log(err.message);
        })
    }

    const GetUserAccess = () => {
        const userrole = sessionStorage.getItem('userrole') != null ? sessionStorage.getItem('userrole').toString() : '';
        fetch("http://localhost:8000/roleaccess?role=" + userrole + "&menu=customer").then(res => {
            if (!res.ok) {
                navigate('/');
            toast.warning('You are not authorized to access');
                return false;
            }
            return res.json();
        }).then(res => {
            console.log(res);
            if (res.length > 0) {
                viewchange(true);
                let userobj = res[0];
                editchange(userobj.haveedit);
                addchange(userobj.haveadd);
                removechange(userobj.havedelete);
            }else{
                navigate('/');
            toast.warning('You are not authorized to access');
            }
        })
    }

    return (
        <div className="container">
            <div className="card">
                <div className="card-title">
                    <h2>Employee Listing</h2>
                </div>
                <div className="card-body">
                    <div className="divbtn">
                        <button onClick={LoadAdd } className="btn btn-success">Add New (+)</button>
                    </div>
                    <table className="table table-bordered">
                        <thead className="bg-dark text-white">
                            <tr>
                                <td>ID</td>
                                <td>Name</td>
                                <td>Email</td>
                                <td>Phone</td>
                                <td>Action</td>
                            </tr>
                        </thead>
                        <tbody>

                            {empdata &&
                                empdata.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.id}</td>
                                        <td>{item.name}</td>
                                        <td>{item.email}</td>
                                        <td>{item.phone}</td>
                                        <td><a onClick={() => { LoadEdit(item.id) }} className="btn btn-success">Edit</a>
                                            <a onClick={() => { Removefunction(item.id) }} className="btn btn-danger">Remove</a>
                                            <a onClick={() => { LoadDetail(item.id) }} className="btn btn-primary">Details</a>
                                        </td>
                                    </tr>
                                ))
                            }

                        </tbody>

                    </table>
                </div>
            </div>
        </div>
    );
}

export default EmpListing;