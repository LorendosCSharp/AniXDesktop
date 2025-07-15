import {
  Button,
  Card,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Rating,
  RatingAdvanced,
  RatingStar,
  RatingAdvancedTheme,
} from "flowbite-react";
import { numberDeclension } from "#/api/utils";
import { useState } from "react";
import { ENDPOINTS } from "#/api/config";

const CustomRatingTheme: RatingAdvancedTheme = {
  base: "flex items-center",
  label: "text-sm font-medium text-cyan-600 dark:text-cyan-500",
  progress: {
    base: "mx-4 h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-700",
    fill: "h-5 rounded bg-yellow-400",
    label: "text-sm font-medium text-cyan-600 dark:text-cyan-500",
  },
};
export const ReleaseInfoRating = (props: {
  release_id: number;
  grade: number;
  token: string | null;
  votes: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
    total: number;
    user: number | null;
  };
}) => {
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [vote, setVote] = useState(props.votes.user);

  return (
    <>
      <Card>
        <div className="flex flex-col gap-2 sm:items-center sm:flex-row">
          <Rating>
            <RatingStar />
            <p className="ml-2 text-sm font-bold dark:text-white">
              {props.grade.toFixed(2)} из 5
            </p>
          </Rating>
          {props.token && (
            <>
              <span className="mx-1.5 h-1 w-1 rounded-full bg-gray-500 dark:bg-gray-400 hidden lg:block" />
              <div className="flex items-center gap-2">
                {vote ?
                  <>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      ваша оценка: {vote}
                    </p>
                    <Button
                      size={"xs"}
                      className="text-gray-500 border border-gray-600 rounded-full hover:bg-black hover:text-white hover:border-black dark:text-gray-400 dark:border-gray-500"
                      color="inline"
                      onClick={() => setIsRatingModalOpen(true)}
                    >
                      изменить
                    </Button>
                  </>
                : <Button
                    size={"xs"}
                    className="text-gray-500 border border-gray-600 rounded-full hover:bg-black hover:text-white hover:border-black dark:text-gray-400 dark:border-gray-500"
                    color="inline"
                    onClick={() => setIsRatingModalOpen(true)}
                  >
                    оценить
                  </Button>
                }
              </div>
            </>
          )}
        </div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {props.votes.total}{" "}
          {numberDeclension(props.votes.total, "голос", "голоса", "голосов")}
        </p>
        <RatingAdvanced
          theme={CustomRatingTheme}
          percentFilled={Math.floor(
            (props.votes["5"] / props.votes.total) * 100
          )}
          className="mb-2"
        >
          5
        </RatingAdvanced>
        <RatingAdvanced
          theme={CustomRatingTheme}
          percentFilled={Math.floor(
            (props.votes["4"] / props.votes.total) * 100
          )}
          className="mb-2"
        >
          4
        </RatingAdvanced>
        <RatingAdvanced
          theme={CustomRatingTheme}
          percentFilled={Math.floor(
            (props.votes["3"] / props.votes.total) * 100
          )}
          className="mb-2"
        >
          3
        </RatingAdvanced>
        <RatingAdvanced
          theme={CustomRatingTheme}
          percentFilled={Math.floor(
            (props.votes["2"] / props.votes.total) * 100
          )}
          className="mb-2"
        >
          2
        </RatingAdvanced>
        <RatingAdvanced
          theme={CustomRatingTheme}
          percentFilled={Math.floor(
            (props.votes["1"] / props.votes.total) * 100
          )}
        >
          1
        </RatingAdvanced>
      </Card>
      <ReleaseInfoRatingModal
        isOpen={isRatingModalOpen}
        setIsOpen={setIsRatingModalOpen}
        token={props.token}
        vote={vote}
        release_id={props.release_id}
        setUserVote={setVote}
      />
    </>
  );
};

const ReleaseInfoRatingModal = (props: {
  isOpen: boolean;
  setIsOpen: any;
  setUserVote: any;
  token: string | null;
  vote: number;
  release_id: number;
}) => {
  const [curElement, setCurElement] = useState(props.vote);
  const [vote, setVote] = useState(props.vote);
  const [isSending, setIsSending] = useState(false);

  async function _sendVote(
    action: "delete" | "add" = "add",
    vote: number | null = null
  ) {
    let url = `${ENDPOINTS.release.info}/vote/${action}/${props.release_id}`;
    if (action === "add") {
      url += `/${vote}`;
    }
    url += `?token=${props.token}`;

    fetch(url);
  }

  function _setVote(
    action: "delete" | "add" = "add",
    vote: number | null = null
  ) {
    if (props.token) {
      _sendVote(action, vote);
      setVote(vote);
      props.setUserVote(vote);
      props.setIsOpen(false);
      setIsSending(false);
    }
  }

  return (
    <Modal
      dismissible
      show={props.isOpen}
      onClose={() => props.setIsOpen(false)}
    >
      <ModalHeader>Оценка</ModalHeader>
      <ModalBody>
        <div>
          <div className="block sm:hidden">
            <Rating size="md" className="justify-center">
              {[1, 2, 3, 4, 5].map((element, index) => (
                <Button
                  key={`rating-md-${element}`}
                  color={"inline"}
                  onMouseOver={() => setCurElement(element)}
                  onMouseOut={() => setCurElement(0)}
                  onClick={() => setVote(element)}
                >
                  <RatingStar
                    filled={index + 1 <= curElement || index + 1 <= vote}
                  />
                </Button>
              ))}
            </Rating>
          </div>
          <div className="hidden sm:block">
            <Rating size="lg" className="justify-center">
              {[1, 2, 3, 4, 5].map((element, index) => (
                <Button
                  key={`rating-lg-${element}`}
                  color={"inline"}
                  onMouseOver={() => setCurElement(element)}
                  onMouseOut={() => setCurElement(0)}
                  onClick={() => setVote(element)}
                >
                  <RatingStar
                    filled={index + 1 <= curElement || index + 1 <= vote}
                  />
                </Button>
              ))}
            </Rating>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <div className="flex gap-1 ml-auto">
          <Button
            disabled={isSending}
            color={"red"}
            onClick={() => {
              setIsSending(true);
              _setVote("delete", null);
            }}
          >
            Убрать оценку
          </Button>
          <Button
            disabled={isSending || vote === null}
            color={"blue"}
            onClick={() => {
              setIsSending(true);
              _sendVote("delete", null);
              setTimeout(() => _setVote("add", vote), 500);
            }}
          >
            Оценить
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};
