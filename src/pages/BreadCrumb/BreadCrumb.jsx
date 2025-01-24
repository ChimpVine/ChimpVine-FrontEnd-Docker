// import React from 'react';
// import { Breadcrumb } from 'react-bootstrap';
// import { NavLink } from 'react-router-dom';

// const NavBreadcrumb = ({ items }) => {
//   return (
//     <Breadcrumb className='breadcrumb-container'>
//       {items.map((item, index) => (
//         <Breadcrumb.Item key={index} active={item.active}>
//           {item.href ? (
//             <NavLink to={item.href} className={item.active ? 'active' : ''}>
//               {item.label}
//             </NavLink>
//           ) : (
//             item.label
//           )}
//         </Breadcrumb.Item>
//       ))}
//     </Breadcrumb>
//   );
// };

// export default NavBreadcrumb;

import React from 'react';
import { Breadcrumb } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const NavBreadcrumb = ({ items }) => {
  return (
    <Breadcrumb className='breadcrumb-container'>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {item.href ? (
            <Breadcrumb.Item linkAs="span">
              <NavLink to={item.href} className={item.active ? 'active' : ''}>
                {item.label}
              </NavLink>
            </Breadcrumb.Item>
          ) : (
            <Breadcrumb.Item active={item.active}>{item.label}</Breadcrumb.Item>
          )}
        </React.Fragment>
      ))}
    </Breadcrumb>
  );
};

export default NavBreadcrumb;

