import { unixToDate, sinceUnixDate } from "#/api/utils";
import { useEffect, useState } from "react";
import { ENDPOINTS } from "#/api/config";
import { Button, Dropdown, DropdownItem } from "flowbite-react";
import Link from "next/link";
import { CommentsAddModal } from "./Comments.Add";
import { CommentsEditModal } from "./Comments.Edit";
import { useUserStore } from "#/store/auth";
import Image from "next/image";

export const CommentsComment = (props: {
  release_id: number;
  profile: { login: string; avatar: string; id: number };
  comment: {
    id: number;
    timestamp: number;
    message: string;
    reply_count: number;
    likes_count: number;
    vote: number;
    isSpoiler: boolean;
    isEdited: boolean;
    isDeleted: boolean;
  };
  isSubComment?: boolean;
  token: string | null;
  isReplying?: boolean;
  parentComment?: any;
  setShouldRender?: (shouldRender: boolean) => void;
  setCommentSend?: (commentSend: boolean) => void;
  type?: "release" | "collection";
}) => {
  const [replies, setReplies] = useState([]);
  const [likes, setLikes] = useState(props.comment.likes_count);
  const [vote, setVote] = useState(props.comment.vote);
  const [isAddCommentsOpen, setIsAddCommentsOpen] = useState(false);
  const [isEditCommentsOpen, setIsEditCommentsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(
    !props.isReplying &&
      (props.comment.isSpoiler || props.comment.likes_count < -5)
  );
  const user: any = useUserStore((state) => state.user);

  const [shouldRender, setShouldRender] = useState(true);
  const [commentSend, setCommentSend] = useState(false);

  let parentCommentId: number | null = null;
  if (props.parentComment) {
    parentCommentId = props.parentComment.id;
  }

  async function _deleteComment() {
    if (props.token) {
      let url;
      if (props.type == "collection") {
        url = `${ENDPOINTS.collection.base}/comment/delete/${props.comment.id}?token=${props.token}`;
      } else {
        url = `${ENDPOINTS.release.info}/comment/delete/${props.comment.id}?token=${props.token}`;
      }
      await fetch(url);

      if (props.setShouldRender && props.setCommentSend) {
        props.setShouldRender(true);
        props.setCommentSend(true);
      }
    }
  }

  useEffect(() => {
    async function _fetchReplies() {
      setReplies([]);
      let url;
      if (props.type == "collection") {
        url = `${ENDPOINTS.collection.base}/comment/replies/${
          parentCommentId || props.comment.id
        }/0?sort=2`;
      } else {
        url = `${ENDPOINTS.release.info}/comment/replies/${
          parentCommentId || props.comment.id
        }/0?sort=2`;
      }

      if (props.token) {
        url += `&token=${props.token}`;
      }
      await fetch(url)
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            return { content: [] };
          }
        })
        .then((data) => {
          if (data && data.content) {
            setReplies(data.content);
          }
        });
    }
    if (
      !props.isSubComment &&
      !props.isReplying &&
      shouldRender &&
      (commentSend || props.comment.reply_count > 0)
    ) {
      _fetchReplies();
      setShouldRender(false);
      setCommentSend(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commentSend]);

  async function _sendVote(action: number) {
    if (props.token) {
      let url;

      if (props.type == "collection") {
        url = `${ENDPOINTS.collection.base}/comment/vote/${props.comment.id}/${action}?token=${props.token}`;
      } else {
        url = `${ENDPOINTS.release.info}/comment/vote/${props.comment.id}/${action}?token=${props.token}`;
      }
      fetch(url);
    }
  }

  // TODO: make it readable
  function _updateVote(action: string) {
    if (action === "like" && vote == 0) {
      setVote(2);
      setLikes(likes + 1);
      _sendVote(2);
    } else if (action === "dislike" && vote == 0) {
      setVote(1);
      setLikes(likes - 1);
      _sendVote(1);
    } else if (action === "like" && vote == 1) {
      setVote(2);
      setLikes(likes + 2);
      _sendVote(2);
    } else if (action === "dislike" && vote == 2) {
      setVote(1);
      setLikes(likes - 2);
      _sendVote(1);
    } else {
      _sendVote(vote);
      setVote(0);
      if (action === "dislike" && vote == 1) {
        setLikes(likes + 1);
      } else if (action === "like" && vote == 2) {
        setLikes(likes - 1);
      }
    }
  }

  return (
    <>
      <article
        className={`${
          !props.isSubComment || props.type == "collection" ? "p-6" : "pt-4"
        } text-sm bg-gray-100 rounded-lg sm:text-base dark:bg-gray-900`}
      >
        <footer className="flex items-center justify-between mb-2">
          <div className="flex flex-col items-start gap-1 sm:items-center sm:flex-row">
            <Link
              href={`/profile/${props.profile.id}`}
              className="inline-flex items-center mr-3 text-sm font-semibold text-gray-900 dark:text-white hover:underline"
            >
              <Image
                className="w-6 h-6 mr-2 rounded-full"
                width={24}
                height={24}
                src={props.profile.avatar}
                alt=""
              />
              {props.profile.login}
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <time
                dateTime={props.comment.timestamp.toString()}
                title={unixToDate(props.comment.timestamp, "full")}
              >
                {sinceUnixDate(props.comment.timestamp)}
              </time>
            </p>
          </div>
          {user && props.profile.id == user.id && (
            <Dropdown
              label=""
              dismissOnClick={false}
              renderTrigger={() => (
                <span className="w-6 h-6 bg-gray-400 iconify mdi--more-horiz hover:bg-gray-800 active:bg-gray-800"></span>
              )}
            >
              <DropdownItem onClick={() => setIsEditCommentsOpen(true)}>
                Редактировать
              </DropdownItem>
              <DropdownItem onClick={() => _deleteComment()}>
                Удалить
              </DropdownItem>
            </Dropdown>
          )}
        </footer>
        <div className="relative flex items-center py-2">
          <p className="text-gray-800 whitespace-pre-wrap dark:text-gray-400">
            {!props.comment.isDeleted ?
              props.comment.message
            : "Комментарий был удалён."}
          </p>
          {isHidden && (
            <button
              className="absolute top-0 bottom-0 left-0 right-0"
              onClick={() => setIsHidden(false)}
            >
              <div className="min-w-full min-h-full px-2 py-1.5 rounded-md bg-black text-white bg-opacity-50 backdrop-blur-[8px] flex flex-col justify-center items-center">
                <p>
                  {props.comment.likes_count < -5 ?
                    "У комментария слишком низкий рейтинг."
                  : "Данный комментарий может содержать спойлер."}
                </p>
                <p className="font-bold">Нажмите, чтобы прочитать</p>
              </div>
            </button>
          )}
        </div>
        {!props.isReplying && !props.comment.isDeleted && (
          <div
            className={`flex items-center justify-between space-x-4 ${
              isHidden ? "mt-4" : ""
            }`}
          >
            {props.token ?
              <button
                type="button"
                className="flex items-center text-sm font-medium text-gray-500 hover:underline dark:text-gray-400"
                onClick={() => setIsAddCommentsOpen(true)}
              >
                <svg
                  className="mr-1.5 w-3.5 h-3.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 18"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 5h5M5 8h2m6-3h2m-5 3h6m2-7H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3v5l5-5h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z"
                  />
                </svg>
                Ответить
              </button>
            : <span></span>}
            <div className="flex items-center">
              <Button
                color="inline"
                onClick={() => {
                  _updateVote("dislike");
                }}
                disabled={!props.token}
              >
                <span
                  className={`w-6 h-6 iconify mdi--dislike ${
                    vote == 1 ?
                      "text-red-500 dark:text-red-400"
                    : "text-gray-500 dark:text-gray-400"
                  }`}
                ></span>
              </Button>
              <p
                className={`text-sm font-medium ${
                  likes > 0 ? "text-green-500 dark:text-green-400"
                  : likes < 0 ? "text-red-500 dark:text-red-400"
                  : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {likes}
              </p>
              <Button
                color="inline"
                onClick={() => {
                  _updateVote("like");
                }}
                disabled={!props.token}
              >
                <span
                  className={`w-6 h-6 iconify mdi--like ${
                    vote == 2 ?
                      "text-green-500 dark:text-green-400"
                    : "text-gray-500 dark:text-gray-400"
                  }`}
                ></span>
              </Button>
            </div>
          </div>
        )}
        {replies.length > 0 &&
          replies.map((comment: any) => (
            <CommentsComment
              key={comment.id}
              release_id={props.release_id}
              profile={comment.profile}
              comment={{
                id: comment.id,
                timestamp: comment.timestamp,
                message: comment.message,
                reply_count: comment.reply_count,
                likes_count: comment.likes_count,
                vote: comment.vote,
                isSpoiler: comment.is_spoiler,
                isEdited: comment.is_edited,
                isDeleted: comment.is_deleted,
              }}
              isSubComment={true}
              token={props.token}
              parentComment={props.parentComment || props.comment}
              setShouldRender={props.setShouldRender || setShouldRender}
              setCommentSend={props.setCommentSend || setCommentSend}
            />
          ))}
      </article>
      <CommentsAddModal
        isOpen={isAddCommentsOpen}
        setIsOpen={setIsAddCommentsOpen}
        release_id={props.release_id}
        token={props.token}
        isReply={true}
        parentComment={props.parentComment || props.comment}
        parentProfile={props.profile}
        setShouldRender={props.setShouldRender || setShouldRender}
        setCommentSend={props.setCommentSend || setCommentSend}
        type={props.type}
      />
      {props.token && (
        <CommentsEditModal
          isOpen={isEditCommentsOpen}
          setIsOpen={setIsEditCommentsOpen}
          token={props.token}
          parentComment={props.comment}
          setShouldRender={props.setShouldRender || setShouldRender}
          setCommentSend={props.setCommentSend || setCommentSend}
          type={props.type}
        />
      )}
    </>
  );
};
