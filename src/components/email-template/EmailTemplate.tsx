import React from "react";

const EmailTemplate = ({
  username,
  message,
}: {
  username: string;
  message: string;
}) => {
  return (
    <div>
      <h1>Hey {username}</h1>
      {message}
    </div>
  );
};

export default EmailTemplate;
