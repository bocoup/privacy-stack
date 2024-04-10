import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { Link, useNavigate } from "@remix-run/react";
import Downshift from "downshift";
import Fuse from "fuse.js";
import { useState } from "react";

import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";

export function Autocomplete({
  items,
}: {
  items: { name: string; id: string }[];
}) {
  const navigate = useNavigate();
  const [search, setSearch] = useState(items);

  const fuse = new Fuse(items, {
    includeScore: true,
    keys: ["name", "body"],
    threshold: 0,
  });

  return (
    <Downshift
      onChange={(selection) => navigate(`/app/dashboard/note/${selection.id}`)}
      itemToString={(item) => (item ? item.name : "")}
      scrollIntoView={(node: HTMLElement) => {
        if (node) {
          node.scrollIntoView({
            behavior: "instant",
            block: "center",
            inline: "nearest",
          });
        }
      }}
    >
      {({
        getInputProps,
        getItemProps,
        getLabelProps,
        getMenuProps,
        isOpen,
        highlightedIndex,
        selectedItem,
        getRootProps,
      }) => (
        <div className="grow flex">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className="sr-only" {...getLabelProps()}>
            Search notes by name or body text
          </label>
          <div
            {...getRootProps({}, { suppressRefError: true })}
            className="grow"
          >
            <Input
              {...getInputProps({
                name: "search",
                placeholder: "Note name or body text",
                className:
                  "w-full flex-1 appearance-none bg-background pl-8 shadow-none",
                onChange: (e) => {
                  const target = e.target as HTMLInputElement;

                  if (target.value.length) {
                    setSearch(fuse.search(target.value).map((r) => r.item));
                  } else {
                    setSearch(items);
                  }
                },
              })}
            />
          </div>
          <div className="absolute top-[37px] left-4 w-[90%]">
            {isOpen ? (
              <ScrollArea className="max-h-96 z-50 bg-white border-b-md shadow p-2 overflow-scroll">
                <ul
                  {...getMenuProps()}
                  className="w-full min-h-screen p-1 flex flex-col"
                >
                  {search.map(
                    (item: { id: string; name: string }, index: number) => (
                      <Link
                        key={index}
                        {...getItemProps({
                          index,
                          item,
                          style: {
                            backgroundColor:
                              highlightedIndex === index
                                ? "lightgray"
                                : "white",
                            fontWeight:
                              selectedItem === item ? "bold" : "normal",
                          },
                        })}
                        to={`/app/dashboard/note/${item.id}`}
                        className="result p-2 flex w-[98%] mx-auto justify-between  hover:bg-slate-100"
                      >
                        {item.name}
                        <ChevronRightIcon className="w-4" />
                      </Link>
                    ),
                  )}
                </ul>
              </ScrollArea>
            ) : null}
          </div>
        </div>
      )}
    </Downshift>
  );
}
